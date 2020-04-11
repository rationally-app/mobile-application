import React, { FunctionComponent } from "react";
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
  const { clearAuthInfo } = useAuthenticationContext();

  const handleLogout = (): void => {
    clearAuthInfo();
    navigation.dispatch(
      NavigationActions.navigate({
        routeName: "LoginScreen"
      })
    );
  };

  const onPress = (): void => {
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

  return (
    <>
      <View style={styles.AppNameWrapper}>
        <AppLogo />
        {!hideLogout && (
          <BaseButton onPress={onPress} iconOnly>
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
