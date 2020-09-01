import { useContext, useState, useCallback } from "react";
import { ImportantMessageSetterContext } from "../context/importantMessage";
import { useAuthenticationContext } from "../context/auth";
import { useProductContext } from "../context/products";
import { Alert } from "react-native";
import { NavigationDispatch, NavigationActions } from "react-navigation";
import { Features } from "../types";
import { CampaignConfigContext } from "../context/campaignConfig";
import { AlertModalContext } from "../context/alert";

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
  const { clearAuthInfo } = useAuthenticationContext();
  const { setProducts, setFeatures, setAllProducts } = useProductContext();
  const { clearCampaignConfig } = useContext(CampaignConfigContext);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { clearAlert } = useContext(AlertModalContext);

  const logout: LogoutHook["logout"] = useCallback(
    async (navigationDispatch, alert) => {
      if (!navigationDispatch) {
        return;
      }
      setIsLoggingOut(true);
      clearAlert();
      await clearAuthInfo();
      await clearCampaignConfig();
      setProducts([]);
      setFeatures({} as Features);
      setAllProducts([]);
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
      clearAlert,
      clearAuthInfo,
      clearCampaignConfig,
      setProducts,
      setFeatures,
      setAllProducts,
      setMessageContent
    ]
  );

  return {
    isLoggingOut,
    logout
  };
};
