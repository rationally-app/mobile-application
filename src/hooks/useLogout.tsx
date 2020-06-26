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
  const { setFeatures, setProducts } = useProductContext();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logout: LogoutHook["logout"] = useCallback(
    async (navigationDispatch, alert) => {
      console.log("logout hook");
      if (!navigationDispatch) {
        return;
      }
      // setIsLoggingOut(true);
      await clearAuthInfo();
      console.log("clear auth info");
      // setFeatures({
      //   REQUIRE_OTP: true,
      //   TRANSACTION_GROUPING: true,
      //   DIST_ENV: "VOUCHERS"
      // });
      // setProducts([]);
      console.log("set features and products");
      // setMessageContent(null);
      console.log("set message content");
      // setIsLoggingOut(false);
      console.log("set is logging out");
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return {
    isLoggingOut,
    logout
  };
};
