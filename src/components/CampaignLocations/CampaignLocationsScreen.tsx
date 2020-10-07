import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useLayoutEffect,
  useCallback
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
import { NavigationProps, AuthCredentials } from "../../types";
import { Sentry } from "../../utils/errorTracking";
import { CampaignConfigsStoreContext } from "../../context/campaignConfigsStore";
import { useDrawerContext } from "../../context/drawer";
import { LoadingView } from "../Loading";
import { Card } from "../Layout/Card";
import { AppText } from "../Layout/AppText";
import { sortBy } from "lodash";
import { getTranslatedStringWithI18n } from "../../utils/translations";

const styles = StyleSheet.create({
  content: {
    position: "relative",
    padding: size(2),
    paddingVertical: size(8),
    height: "100%",
    width: 512,
    maxWidth: "100%"
  },
  headerText: {
    marginBottom: size(4)
  },
  bannerWrapper: {
    marginBottom: size(1.5)
  },
  loadingViewWrapper: {
    alignItems: "center",
    justifyContent: "center"
  },
  selectCampaignHeader: {
    fontFamily: "brand-bold",
    fontSize: fontSize(1)
  },
  campaignLocationWrapper: {
    marginHorizontal: -size(3),
    marginTop: size(2)
  }
});

export const CampaignLocationsScreen: FunctionComponent<NavigationProps> = ({
  navigation
}) => {
  useEffect(() => {
    Sentry.addBreadcrumb({
      category: "navigation",
      message: "CampaignLocationsScreen"
    });
  }, []);

  const messageContent = useContext(ImportantMessageContentContext);
  const showHelpModal = useContext(HelpModalContext);

  const {
    hasLoadedFromStore: hasLoadedAuthFromStore,
    authCredentials
  } = useContext(AuthStoreContext);
  const {
    hasLoadedFromStore: hasLoadedCampaignConfigFromStore,
    allCampaignConfigs
  } = useContext(CampaignConfigsStoreContext);

  const { setDrawerButtons } = useDrawerContext();

  useEffect(() => {
    setDrawerButtons([
      {
        icon: "map-marker-plus",
        label: getTranslatedStringWithI18n("navigationDrawer", "addCampaign"),
        onPress: () => {
          navigation.navigate("LoginScreen");
        }
      },
      {
        icon: "map-search",
        label: getTranslatedStringWithI18n(
          "navigationDrawer",
          "changeChampaign"
        ),
        onPress: () => {
          navigation.navigate("CampaignLocationsScreen");
        }
      }
    ]);
  }, [authCredentials, hasLoadedAuthFromStore, navigation, setDrawerButtons]);

  const navigateToCampaignLocation = useCallback(
    (authCredentials: AuthCredentials): void => {
      navigation.navigate("CampaignInitialisationScreen", {
        authCredentials
      });
    },
    [navigation]
  );

  useLayoutEffect(() => {
    if (hasLoadedAuthFromStore) {
      const numCampaignLocations = Object.keys(authCredentials).length;
      if (
        numCampaignLocations === 1 &&
        Date.now() < Object.values(authCredentials)[0].expiry
      ) {
        // Automatically go to the only valid campaign location
        navigateToCampaignLocation(Object.values(authCredentials)[0]);
      } else if (numCampaignLocations === 0) {
        // Automatically go to the Login Screen to add a campaign
        navigation.navigate("LoginScreen");
      }
    }
  }, [
    authCredentials,
    hasLoadedAuthFromStore,
    navigateToCampaignLocation,
    navigation
  ]);
  const authCredentialsWithCampaignName = Object.entries(authCredentials).map(
    ([key, credentials]) => ({
      ...credentials,
      key,
      name: allCampaignConfigs[key]?.features?.campaignName
    })
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
            <AppHeader />
          </View>
          {messageContent && (
            <View style={styles.bannerWrapper}>
              <Banner {...messageContent} />
            </View>
          )}

          {hasLoadedAuthFromStore && hasLoadedCampaignConfigFromStore ? (
            <Card>
              <AppText style={styles.selectCampaignHeader}>
                {getTranslatedStringWithI18n(
                  "navigationDrawer",
                  "selectCampaign"
                )}
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
                      `${getTranslatedStringWithI18n(
                        "navigationDrawer",
                        "campaign"
                      )} ${idx + 1}`
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
