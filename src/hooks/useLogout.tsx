import { useContext, useState, useCallback } from "react";
import { ImportantMessageSetterContext } from "../context/importantMessage";
import { useAuthenticationContext } from "../context/auth";
import { useProductContext } from "../context/products";
import { Alert } from "react-native";
import { NavigationDispatch, NavigationActions } from "react-navigation";
import { Features } from "../types";
import { CampaignConfigContext } from "../context/campaignConfig";

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

  const logout: LogoutHook["logout"] = useCallback(
    async (navigationDispatch, alert) => {
      if (!navigationDispatch) {
        return;
      }
      setIsLoggingOut(true);
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
        Alert.alert(title, description);
      }
    },
    [
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
