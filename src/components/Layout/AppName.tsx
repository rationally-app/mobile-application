import React, { FunctionComponent, useEffect } from "react";
import { color, fontSize, size } from "../../common/styles";
import { View, StyleSheet, Alert } from "react-native";
import { AppText } from "./AppText";
import { AppMode } from "../../context/config";
import AppLogo from "../../../assets/Logo.svg";
import { BaseButton } from "./Buttons/BaseButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuthenticationContext } from "../../context/auth";
import { withNavigation, NavigationActions } from "react-navigation";
import { NavigationProps } from "../../types";

const TIME_BEFORE_WARNING = 900000;
let warningTimer: NodeJS.Timeout;
let logoutTimer: NodeJS.Timeout;

interface AppName extends NavigationProps {
  mode?: AppMode;
  hideLogout?: boolean;
}

const styles = StyleSheet.create({
  AppNameWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center"
  }
});

export const AppNameComponent: FunctionComponent<AppName> = ({
  mode = AppMode.production,
  hideLogout,
  navigation
}) => {
  const { expiry, clearAuthInfo } = useAuthenticationContext();

  const handleLogout = (): void => {
    clearAuthInfo();
    navigation.dispatch(
      NavigationActions.navigate({
        routeName: "LoginScreen"
      })
    );
    Alert.alert("You have successfully been logged out");
  };

  const onPressLogout = (): void => {
    Alert.alert(
      "You are about to logout",
      "Are you sure?",
      [
        {
          text: "Logout",
          onPress: handleLogout
        },
        {
          text: "Cancel",
          style: "cancel"
        }
      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    if (!hideLogout) {
      const showWarning = (): void => {
        Alert.alert(
          "Your QR code will expire in 15mins",
          "Please logout and login with a new QR code.",
          [
            {
              text: "Logout now",
              onPress: handleLogout
            },
            {
              text: "I'll do so in 15mins",
              style: "cancel"
            }
          ],
          { cancelable: false }
        );
      };

      const timeLeft = Number(expiry) - new Date().getTime();
      warningTimer = setTimeout(showWarning, timeLeft - TIME_BEFORE_WARNING);
      logoutTimer = setTimeout(handleLogout, timeLeft);
      return () => {
        clearTimeout(warningTimer);
        clearTimeout(logoutTimer);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <View style={styles.AppNameWrapper}>
        <AppLogo />
        {!hideLogout && (
          <BaseButton onPress={onPressLogout} iconOnly>
            <MaterialCommunityIcons
              name="logout"
              size={size(3)}
              color={color("grey", 0)}
            />
          </BaseButton>
        )}
      </View>
      {mode === AppMode.staging ? (
        <AppText
          style={{
            color: color("red", 50),
            fontFamily: "inter-bold",
            fontSize: fontSize(2)
          }}
        >
          TESTING MODE
        </AppText>
      ) : null}
    </>
  );
};

export const AppName = withNavigation(AppNameComponent);
