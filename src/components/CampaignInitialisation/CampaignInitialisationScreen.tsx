import React, {
  FunctionComponent,
  useEffect,
  useCallback,
  useState,
  useContext
} from "react";
import { Sentry } from "../../utils/errorTracking";
import { StyleSheet, View } from "react-native";
import { size } from "../../common/styles";
import { NavigationProps, AuthCredentials } from "../../types";
import { UpdateByRestartingAlert } from "./UpdateByRestartingAlert";
import { UpdateFromAppStoreAlert } from "./UpdateFromAppStoreAlert";
import { LoadingView } from "../Loading";
import { useUpdateCampaignConfig } from "../../hooks/useUpdateCampaignConfig/useUpdateCampaignConfig";
import { useCheckUpdates } from "../../hooks/useCheckUpdates";
import { CampaignConfigError } from "../../services/campaignConfig";
import { AlertModalContext, ERROR_MESSAGE } from "../../context/alert";
import { CampaignConfigsStoreContext } from "../../context/campaignConfigsStore";
import * as config from "../../config";
import { checkVersion } from "./utils";
import { SessionError } from "../../services/helpers";
import { AuthStoreContext } from "../../context/authStore";

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

  const authCredentials: AuthCredentials = navigation.getParam(
    "authCredentials"
  );
  const {
    hasLoadedFromStore,
    allCampaignConfigs,
    setCampaignConfig,
    removeCampaignConfig
  } = useContext(CampaignConfigsStoreContext);
  const { setAuthCredentials } = useContext(AuthStoreContext);
  const {
    fetchingState,
    updateCampaignConfig,
    error: updateCampaignConfigError
  } = useUpdateCampaignConfig(
    authCredentials.operatorToken,
    authCredentials.sessionToken,
    authCredentials.endpoint
  );
  const checkUpdates = useCheckUpdates();
  const { showErrorAlert } = useContext(AlertModalContext);

  const key = `${authCredentials.operatorToken}${authCredentials.endpoint}`;
  const campaignConfig = allCampaignConfigs[key];

  const [hasAttemptedToUpdateConfig, setHasAttemptedToUpdateConfig] = useState(
    false
  );
  useEffect(() => {
    if (hasLoadedFromStore && !hasAttemptedToUpdateConfig) {
      updateCampaignConfig(campaignConfig, setCampaignConfig);
      setHasAttemptedToUpdateConfig(true);
    }
  }, [
    setCampaignConfig,
    campaignConfig,
    hasAttemptedToUpdateConfig,
    hasLoadedFromStore,
    updateCampaignConfig
  ]);

  useEffect(() => {
    if (updateCampaignConfigError) {
      if (updateCampaignConfigError instanceof CampaignConfigError) {
        Sentry.captureException(updateCampaignConfigError);
        showErrorAlert({
          title: "System error",
          description: ERROR_MESSAGE.CAMPAIGN_CONFIG_ERROR
        });
      } else if (updateCampaignConfigError instanceof SessionError) {
        setAuthCredentials(key, {
          ...authCredentials,
          expiry: new Date().getTime()
        });
        showErrorAlert({
          title: "Expired",
          description: ERROR_MESSAGE.AUTH_FAILURE_INVALID_TOKEN,
          onOk: () => {
            navigation.navigate("CampaignLocationsScreen");
          }
        });
      } else {
        throw updateCampaignConfigError; // Let ErrorBoundary handle
      }
    }
  }, [
    setAuthCredentials,
    authCredentials,
    key,
    navigation,
    removeCampaignConfig,
    showErrorAlert,
    updateCampaignConfigError
  ]);

  const continueToNormalFlow = useCallback(() => {
    if (campaignConfig?.features?.flowType) {
      switch (campaignConfig?.features?.flowType) {
        case "DEFAULT":
          navigation.navigate("CustomerQuotaStack", {
            operatorToken: authCredentials.operatorToken,
            endpoint: authCredentials.endpoint
          });
          break;
        case "MERCHANT":
          navigation.navigate("MerchantPayoutStack", {
            operatorToken: authCredentials.operatorToken,
            endpoint: authCredentials.endpoint
          });
          break;
      }
    }
  }, [
    authCredentials.endpoint,
    authCredentials.operatorToken,
    campaignConfig?.features?.flowType,
    navigation
  ]);

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
      const versionCheckResult = checkVersion({
        currentBinaryVersion: config.APP_BINARY_VERSION,
        currentBuildVersion: config.APP_BUILD_VERSION,
        minBinaryVersion: campaignConfig?.features?.minAppBinaryVersion,
        minBuildVersion: campaignConfig?.features?.minAppBuildVersion
      });
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
  }, [
    campaignConfig?.features?.minAppBinaryVersion,
    campaignConfig?.features?.minAppBuildVersion,
    continueToNormalFlow,
    getNewBuildIfAny
  ]);

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
