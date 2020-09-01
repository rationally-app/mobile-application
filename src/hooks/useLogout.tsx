import { useContext, useState, useCallback } from "react";
import { ImportantMessageSetterContext } from "../context/importantMessage";
import { Alert } from "react-native";
import { NavigationDispatch, NavigationActions } from "react-navigation";
import { AuthStoreContext } from "../context/authStore";
import { CampaignConfigsStoreContext } from "../context/campaignConfigsStore";
import { ConfigContext } from "../context/config";

type AlertProps = {
  title: string;
  description?: string;
};

interface LogoutHook {
  isLoggingOut: boolean;
  logout: (
    navigationDispatch: NavigationDispatch | undefined,
    alert?: AlertProps
  ) => void;
}

export const useLogout = (): LogoutHook => {
  const setMessageContent = useContext(ImportantMessageSetterContext);
  const { setConfigValue } = useContext(ConfigContext);
  const { clearAuthCredentials } = useContext(AuthStoreContext);
  const { clearCampaignConfigs } = useContext(CampaignConfigsStoreContext);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logout: LogoutHook["logout"] = useCallback(
    async (navigationDispatch, alert) => {
      if (!navigationDispatch) {
        return;
      }
      setIsLoggingOut(true);
      clearAuthCredentials();
      clearCampaignConfigs();
      setConfigValue("mobileNumber", undefined);
      setMessageContent(null);
      setIsLoggingOut(false);
      navigationDispatch?.(
        NavigationActions.navigate({
          routeName: "LoginScreen"
        })
      );
      if (alert) {
        const { title, description } = alert;
        // using react-native alerts here for now because there are cases where the user is currently on a (non-alert) modal
        // but is logged out, so two modals will be visible at once, causing some problems on ios
        Alert.alert(title, description);
      }
    },
    [
      setConfigValue,
      clearAuthCredentials,
      clearCampaignConfigs,
      setMessageContent
    ]
  );

  return {
    isLoggingOut,
    logout
  };
};
