import { useContext, useState, useCallback } from "react";
import { ImportantMessageSetterContext } from "../context/importantMessage";
import { useAuthenticationContext } from "../context/auth";
import { useProductContext } from "../context/products";
import { NavigationDispatch, NavigationActions } from "react-navigation";
import { Features } from "../types";
import { CampaignConfigContext } from "../context/campaignConfig";
import { AlertModalContext } from "../context/alert";
import { AlertModalProps } from "../components/AlertModal/AlertModal";

interface LogoutHook {
  isLoggingOut: boolean;
  logout: (
    navigationDispatch: NavigationDispatch | undefined,
    alert?: AlertModalProps
  ) => void;
}

export const useLogout = (): LogoutHook => {
  const setMessageContent = useContext(ImportantMessageSetterContext);
  const { clearAuthInfo } = useAuthenticationContext();
  const { setProducts, setFeatures, setAllProducts } = useProductContext();
  const { clearCampaignConfig } = useContext(CampaignConfigContext);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { showAlert } = useContext(AlertModalContext);

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
        showAlert(alert);
      }
    },
    [
      clearAuthInfo,
      clearCampaignConfig,
      setProducts,
      setFeatures,
      setAllProducts,
      setMessageContent,
      showAlert
    ]
  );

  return {
    isLoggingOut,
    logout
  };
};
