import { useContext, useState, useCallback } from "react";
import { ImportantMessageSetterContext } from "../context/importantMessage";
import { Alert } from "react-native";
import { AuthStoreContext } from "../context/authStore";
import { CampaignConfigsStoreContext } from "../context/campaignConfigsStore";

type AlertProps = {
  title: string;
  description?: string;
};

interface LogoutHook {
  isLoggingOut: boolean;
  logout: (alert?: AlertProps) => void;
}

export const useLogout = (): LogoutHook => {
  const setMessageContent = useContext(ImportantMessageSetterContext);
  const { clearAuthCredentials } = useContext(AuthStoreContext);
  const { clearCampaignConfigs } = useContext(CampaignConfigsStoreContext);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logout: LogoutHook["logout"] = useCallback(
    async alert => {
      setIsLoggingOut(true);
      clearAuthCredentials();
      clearCampaignConfigs();
      setMessageContent(null);
      setIsLoggingOut(false);
      if (alert) {
        const { title, description } = alert;
        // using react-native alerts here for now because there are cases where the user is currently on a (non-alert) modal
        // but is logged out, so two modals will be visible at once, causing some problems on ios
        Alert.alert(title, description);
      }
    },
    [clearAuthCredentials, clearCampaignConfigs, setMessageContent]
  );

  return {
    isLoggingOut,
    logout
  };
};
