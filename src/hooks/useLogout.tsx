import { useContext, useState, useCallback } from "react";
import { ImportantMessageSetterContext } from "../context/importantMessage";
import { useAuthenticationContext } from "../context/auth";
import { useProductContext } from "../context/products";
import { Alert } from "react-native";
import { NavigationDispatch, NavigationActions } from "react-navigation";

type AlertProps = {
  title: string;
  description?: string;
};

interface LogoutHook {
  isLoggingOut: boolean;
  logout: (navigationDispatch?: NavigationDispatch, alert?: AlertProps) => void;
}

export const useLogout = (): LogoutHook => {
  const setMessageContent = useContext(ImportantMessageSetterContext);
  const { clearAuthInfo } = useAuthenticationContext();
  const { setProducts } = useProductContext();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logout: LogoutHook["logout"] = useCallback(
    async (navigationDispatch, alert) => {
      if (!navigationDispatch) {
        return;
      }
      setIsLoggingOut(true);
      await clearAuthInfo();
      setProducts([]);
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
    [clearAuthInfo, setMessageContent, setProducts]
  );

  return {
    isLoggingOut,
    logout
  };
};
