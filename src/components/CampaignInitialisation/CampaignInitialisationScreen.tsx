import React, {
  FunctionComponent,
  useEffect,
  useCallback,
  useState
} from "react";
import { Sentry } from "../../utils/errorTracking";
import { StyleSheet, View } from "react-native";
import { size } from "../../common/styles";
import { NavigationProps } from "../../types";
import { UpdateByRestartingAlert } from "./UpdateByRestartingAlert";
import { UpdateFromAppStoreAlert } from "./UpdateFromAppStoreAlert";
import { LoadingView } from "../Loading";
import { useUpdateCampaignConfig } from "../../hooks/useUpdateCampaignConfig/useUpdateCampaignConfig";
import { useAuthenticationContext } from "../../context/auth";
import { useCheckVersion } from "../../hooks/useCheckVersion/useCheckVersion";
import { useCheckUpdates } from "../../hooks/useCheckUpdates";

const styles = StyleSheet.create({
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: size(5)
  },
  content: {
    width: 512,
    maxWidth: "100%",
    marginTop: -size(4)
  }
});

const RETRY_UPDATE_TIMES = 3;

export class UpdateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UpdateError";
  }
}

export const CampaignInitialisationScreen: FunctionComponent<NavigationProps> = ({
  navigation
}) => {
  useEffect(() => {
    Sentry.addBreadcrumb({
      category: "navigation",
      message: "CampaignInitialisationScreen"
    });
  }, []);

  const { token, endpoint } = useAuthenticationContext();
  const {
    fetchingState,
    updateCampaignConfig,
    error: fetchCampaignConfigError
  } = useUpdateCampaignConfig(token, endpoint);
  const checkVersion = useCheckVersion();
  const checkUpdates = useCheckUpdates();

  useEffect(() => {
    updateCampaignConfig();
    // updating the campaign config should only happen once when this screen is loaded
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (fetchCampaignConfigError) {
      throw fetchCampaignConfigError; // Let ErrorBoundary handle
    }
  }, [fetchCampaignConfigError]);

  const continueToNormalFlow = useCallback(() => {
    const flowType = navigation.getParam("flowType", "DEFAULT");
    switch (flowType) {
      case "DEFAULT":
        navigation.navigate("CollectCustomerDetailsScreen");
        break;
      case "MERCHANT":
        navigation.navigate("MerchantPayoutScreen");
        break;
    }
  }, [navigation]);

  const [outdatedType, setOutdatedType] = useState<"BINARY" | "BUILD">();

  const setState = useState()[1];
  /**
   * Tries up to RETRY_UPDATE_TIMES times to get the latest build version.
   * If unable to retrieve it, don't allow the user to continue since the user
   * has already failed the compatibility check.
   */
  const getNewBuildIfAny = useCallback(async (): Promise<void> => {
    let lastUpdateResult;
    for (let i = 0; i < RETRY_UPDATE_TIMES; i++) {
      Sentry.addBreadcrumb({
        category: "checkUpdates",
        message: `attempt ${i + 1}`
      });
      const updateResult = await checkUpdates(true);
      if (updateResult === "UPDATE_READY") {
        setOutdatedType("BUILD");
        return;
      } else {
        lastUpdateResult = updateResult;
        continue;
      }
    }

    // In the case that there's NO_UPDATE, then we probably set the
    // minimum build version too early, before the app updates have
    // been released.
    const error = new UpdateError(
      `Error while trying to check for updates: ${lastUpdateResult}`
    );
    // https://github.com/facebook/react/issues/14981#issuecomment-468460187
    setState(() => {
      throw error; // Let ErrorBoundary handle
    });
  }, [checkUpdates, setState]);

  /**
   * When there's a new updated campaign config, check for version
   * compatibility and whether is a binary version or build version
   * that is incompatible.
   */
  const handleNewCampaignConfig = useCallback((): void => {
    try {
      const versionCheckResult = checkVersion();
      switch (versionCheckResult) {
        case "OK":
          continueToNormalFlow();
          break;
        case "OUTDATED_BINARY":
          setOutdatedType("BINARY");
          break;
        case "OUTDATED_BUILD":
          // Attempts to retrieve new updates so restarting the app will apply
          // the new updates immediately.
          // Note: Errors when getting new build are handled inside this function
          getNewBuildIfAny();
          break;
      }
    } catch (e) {
      throw e; // Let ErrorBoundary handle
    }
  }, [checkVersion, continueToNormalFlow, getNewBuildIfAny]);

  /**
   * When the campaign config has been fetched, figure out if version is
   * compatible and whether the user can proceed.
   */
  useEffect(() => {
    if (fetchingState === "RETURNED_NEW_UPDATES") {
      handleNewCampaignConfig();
    } else if (fetchingState === "RETURNED_NO_UPDATES") {
      continueToNormalFlow();
    }
  }, [continueToNormalFlow, fetchingState, handleNewCampaignConfig]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.content}>
        {outdatedType === "BINARY" ? (
          <UpdateFromAppStoreAlert />
        ) : outdatedType === "BUILD" ? (
          <UpdateByRestartingAlert />
        ) : (
          <LoadingView />
        )}
      </View>
    </View>
  );
};
