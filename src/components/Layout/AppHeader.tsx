import React, { FunctionComponent, useEffect, useCallback } from "react";
import { color, size, borderRadius } from "../../common/styles";
import { View, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { AppMode } from "../../context/config";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuthenticationContext } from "../../context/auth";
import { withNavigation, NavigationActions } from "react-navigation";
import { NavigationProps } from "../../types";
import { AppName } from "./AppName";
import { AppText } from "./AppText";

const TIME_BEFORE_WARNING = 900000;
let warningTimer: NodeJS.Timeout;
let logoutTimer: NodeJS.Timeout;

interface AppHeader extends NavigationProps {
  mode?: AppMode;
}

const styles = StyleSheet.create({
  appHeaderWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center"
  }
});

export const AppHeaderComponent: FunctionComponent<AppHeader> = ({
  mode = AppMode.production,
  navigation
}) => {
  const { expiry, clearAuthInfo } = useAuthenticationContext();

  const handleLogout = useCallback((): void => {
    clearAuthInfo();
    navigation.dispatch(
      NavigationActions.navigate({
        routeName: "LoginScreen"
      })
    );
    Alert.alert("You have successfully been logged out");
  }, [clearAuthInfo, navigation]);

  const onPressLogout = (): void => {
    Alert.alert(
      "You are about to logout",
      "Are you sure?",
      [
        {
          text: "Cancel"
        },
        {
          text: "Logout",
          onPress: handleLogout,
          style: "destructive"
        }
      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    const showWarning = (): void => {
      Alert.alert(
        "Your QR code will expire in 15 mins",
        "Please logout and login with a new QR code.",
        [
          {
            text: "I'll do so in 15 mins"
          },
          {
            text: "Logout now",
            onPress: handleLogout,
            style: "destructive"
          }
        ],
        { cancelable: false }
      );
    };

    const timeLeft = Math.min(604800000, Number(expiry) - new Date().getTime());
    warningTimer = setTimeout(showWarning, timeLeft - TIME_BEFORE_WARNING);
    logoutTimer = setTimeout(handleLogout, timeLeft);

    return () => {
      clearTimeout(warningTimer);
      clearTimeout(logoutTimer);
    };
  }, [expiry, handleLogout]);

  return (
    <View style={styles.appHeaderWrapper}>
      <AppName mode={mode} />
      <TouchableOpacity onPress={onPressLogout}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <AppText style={{ color: color("grey", 0), marginRight: size(1) }}>
            Logout
          </AppText>
          <MaterialCommunityIcons
            name="logout"
            size={size(3)}
            color={color("grey", 0)}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export const AppHeader = withNavigation(AppHeaderComponent);
