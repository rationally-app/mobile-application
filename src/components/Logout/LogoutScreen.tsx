import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { color, size } from "../../common/styles";
import { AlertModalContext } from "../../context/alert";
import { AuthStoreContext } from "../../context/authStore";
import { CampaignConfigsStoreContext } from "../../context/campaignConfigsStore";
import { ConfigContext } from "../../context/config";
import { ImportantMessageSetterContext } from "../../context/importantMessage";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { callLogout, LogoutError } from "../../services/auth";
import { NavigationProps } from "../../types";
import { Sentry } from "../../utils/errorTracking";
import { allSettled } from "../../utils/promiseAllSettled";
import { AppText } from "../Layout/AppText";
import { Card } from "../Layout/Card";
import { TopBackground } from "../Layout/TopBackground";

const styles = StyleSheet.create({
  loadingWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});

export const LogoutScreen: FunctionComponent<NavigationProps> = ({
  navigation,
}) => {
  useEffect(() => {
    Sentry.addBreadcrumb({
      category: "navigation",
      message: "LogoutScreen",
    });
  }, []);

  const { i18nt } = useTranslate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const {
    authCredentials,
    removeAuthCredentials,
    clearAuthCredentials,
  } = useContext(AuthStoreContext);
  const { removeCampaignConfig, clearCampaignConfigs } = useContext(
    CampaignConfigsStoreContext
  );
  const { setConfigValue } = useContext(ConfigContext);
  const setMessageContent = useContext(ImportantMessageSetterContext);
  const { showErrorAlert } = useContext(AlertModalContext);

  const [, setState] = useState();
  useEffect(() => {
    const logoutAllCampaigns: () => Promise<void> = async () => {
      setIsLoggingOut(true);
      const results = await allSettled(
        Object.entries(authCredentials).map(
          async ([key, { sessionToken, operatorToken, endpoint }]) => {
            await callLogout(sessionToken, operatorToken, endpoint);
            removeAuthCredentials(key);
            removeCampaignConfig(key);
          }
        )
      );
      const errorResults = results.filter(
        (result) => result.status === "rejected"
      );
      console.log(JSON.stringify(errorResults));
      if (errorResults.length > 0) {
        const error: Error = (errorResults[0] as PromiseRejectedResult).reason;
        if (error instanceof LogoutError) {
          showErrorAlert(error);
          navigation.navigate("CampaignLocationsScreen", {
            shouldAutoLoad: false,
          });
        } else {
          setState(() => {
            throw error;
          }); // let error boundary handle
        }
      } else {
        // shouldn't be necessary but just to be safe
        clearAuthCredentials();
        clearCampaignConfigs();

        setConfigValue("fullMobileNumber", undefined);
        setMessageContent(null);
        navigation.navigate("LoginScreen");
      }
    };
    if (!isLoggingOut) {
      logoutAllCampaigns();
    }
  });

  return (
    <View style={styles.loadingWrapper}>
      <TopBackground style={{ height: "100%", maxHeight: "auto" }} />
      <Card>
        <ActivityIndicator size="large" color={color("grey", 40)} />
        <AppText style={{ marginTop: size(1) }}>
          {i18nt("logoutScreen", "loggingOut")}
        </AppText>
      </Card>
    </View>
  );
};
