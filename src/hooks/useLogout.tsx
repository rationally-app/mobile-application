import { useCallback } from "react";
import { Alert } from "react-native";
import { NavigationDispatch, NavigationActions } from "react-navigation";

type AlertProps = {
  title: string;
  description?: string;
};

interface LogoutHook {
  logout: (
    navigationDispatch: NavigationDispatch | undefined,
    alert?: AlertProps
  ) => void;
}

export const useLogout = (): LogoutHook => {
  const logout: LogoutHook["logout"] = useCallback(
    async (navigationDispatch, alert) => {
      if (!navigationDispatch) {
        return;
      }
      navigationDispatch?.(
        NavigationActions.navigate({
          routeName: "LogoutScreen",
        })
      );
      if (alert) {
        const { title, description } = alert;
        // using react-native alerts here for now because there are cases where the user is currently on a (non-alert) modal
        // but is logged out, so two modals will be visible at once, causing some problems on ios
        Alert.alert(title, description);
      }
    },
    []
  );

  return {
    logout,
  };
};
