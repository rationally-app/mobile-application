import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import { View, StyleSheet } from "react-native";
import { size, fontSize } from "../../common/styles";
import { Credits } from "../Credits";
import { KeyboardAvoidingScrollView } from "../Layout/KeyboardAvoidingScrollView";
import { TopBackground } from "../Layout/TopBackground";
import { AppHeader } from "../Layout/AppHeader";
import { ImportantMessageContentContext } from "../../context/importantMessage";
import { Banner } from "../Layout/Banner";
import { FeatureToggler } from "../FeatureToggler/FeatureToggler";
import { HelpButton } from "../Layout/Buttons/HelpButton";
import { HelpModalContext } from "../../context/help";
import { AuthStoreContext } from "../../context/authStore";
import { CampaignLocationsListItem } from "./CampaignLocationsListItem";
import {
  AuthCredentials,
  CampaignLocationsScreenNavigationProps,
  Screens,
} from "../../types";
import { Sentry } from "../../utils/errorTracking";
import { CampaignConfigsStoreContext } from "../../context/campaignConfigsStore";
import { useDrawerContext } from "../../context/drawer";
import { LoadingView } from "../Loading";
import { Card } from "../Layout/Card";
import { AppText } from "../Layout/AppText";
import { sortBy } from "lodash";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { useConfigContext } from "../../context/config";

const styles = StyleSheet.create({
  content: {
    position: "relative",
    padding: size(2),
    paddingVertical: size(8),
    height: "100%",
    width: 512,
    maxWidth: "100%",
  },
  headerText: {
    marginBottom: size(4),
  },
  bannerWrapper: {
    marginBottom: size(1.5),
  },
  loadingViewWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  selectCampaignHeader: {
    fontFamily: "brand-bold",
    fontSize: fontSize(1),
  },
  campaignLocationWrapper: {
    marginHorizontal: -size(3),
    marginTop: size(2),
  },
});

export const CampaignLocationsScreen: FunctionComponent<
  CampaignLocationsScreenNavigationProps
> = ({ navigation, route }) => {
  useEffect(() => {
    Sentry.addBreadcrumb({
      category: "navigation",
      message: "CampaignLocationsScreen",
    });
  }, []);

  const { config } = useConfigContext();
  /**
   * Determines whether the app should automatically load a campaign if there
   * is only one existing campaign
   */
  const shouldAutoLoad: boolean = route?.params?.shouldAutoLoad ?? true; // true by default

  const messageContent = useContext(ImportantMessageContentContext);
  const showHelpModal = useContext(HelpModalContext);

  const { hasLoadedFromStore: hasLoadedAuthFromStore, authCredentials } =
    useContext(AuthStoreContext);
  const {
    hasLoadedFromStore: hasLoadedCampaignConfigFromStore,
    allCampaignConfigs,
  } = useContext(CampaignConfigsStoreContext);

  const { setDrawerButtons } = useDrawerContext();

  const { i18nt, c13nt } = useTranslate();

  useEffect(() => {
    /**
     * Determines whether the app should automatically load a campaign if there
     * is only one existing campaign
     */
    setDrawerButtons([
      {
        icon: "map-marker-plus",
        label: i18nt("navigationDrawer", "addCampaign"),
        onPress: () => {
          navigation.navigate(Screens.LoginScreen);
        },
      },
      {
        icon: "map-search",
        label: i18nt("navigationDrawer", "changeChampaign"),
        onPress: () => {
          navigation.navigate(Screens.CampaignLocationsScreen, {
            shouldAutoLoad,
          });
        },
      },
    ]);
  }, [
    authCredentials,
    hasLoadedAuthFromStore,
    navigation,
    setDrawerButtons,
    i18nt,
    shouldAutoLoad,
  ]);

  const navigateToCampaignLocation = useCallback(
    (authCredentials: AuthCredentials): void => {
      navigation.navigate(Screens.CampaignInitialisationScreen, {
        authCredentials,
      });
    },
    [navigation]
  );

  useLayoutEffect(() => {
    if (hasLoadedAuthFromStore) {
      const numCampaignLocations = Object.keys(authCredentials).length;
      if (
        numCampaignLocations === 1 &&
        Date.now() < Object.values(authCredentials)[0].expiry &&
        shouldAutoLoad
      ) {
        // Automatically go to the only valid campaign location
        navigateToCampaignLocation(Object.values(authCredentials)[0]);
      } else if (numCampaignLocations === 0) {
        // Automatically go to the Login Screen to add a campaign
        navigation.navigate(Screens.LoginScreen);
      }
    }
  }, [
    authCredentials,
    hasLoadedAuthFromStore,
    navigateToCampaignLocation,
    navigation,
    shouldAutoLoad,
  ]);
  const authCredentialsWithCampaignName = Object.entries(authCredentials).map(
    ([key, credentials]) => {
      return {
        ...credentials,
        key,
        name: c13nt(allCampaignConfigs[key]?.features?.campaignName ?? "", key),
      };
    }
  );

  const sortedAuthCredentialsWithCampaignName = sortBy(
    authCredentialsWithCampaignName,
    "name"
  );
  

  return (
    <>
      <Credits style={{ bottom: size(3) }} />
      <KeyboardAvoidingScrollView>
        <TopBackground />
        <View style={styles.content}>
          <View style={styles.headerText}>
            <AppHeader mode={config.appMode} />
          </View>
          {messageContent && (
            <View style={styles.bannerWrapper}>
              <Banner {...messageContent} />
            </View>
          )}

          {hasLoadedAuthFromStore && hasLoadedCampaignConfigFromStore ? (
            <Card>
              <AppText style={styles.selectCampaignHeader}>
                {i18nt("navigationDrawer", "selectCampaign")}
              </AppText>
              {sortedAuthCredentialsWithCampaignName.map((credentials, idx) => (
                <View
                  key={credentials.key}
                  style={styles.campaignLocationWrapper}
                >
                  <CampaignLocationsListItem
                    {...credentials}
                    name={
                      credentials.name ||
                      `${i18nt("navigationDrawer", "campaign")} ${idx + 1}`
                    }
                    onPress={() => navigateToCampaignLocation(credentials)}
                  />
                </View>
              ))}
            </Card>
          ) : (
            <Card style={styles.loadingViewWrapper}>
              <LoadingView wrapperStyle={{ height: "50%" }} />
            </Card>
          )}
          <FeatureToggler feature="HELP_MODAL">
            <HelpButton onPress={showHelpModal} />
          </FeatureToggler>
        </View>
      </KeyboardAvoidingScrollView>
    </>
  );
};
