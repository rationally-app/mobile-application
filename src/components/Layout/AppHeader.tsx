import React, { FunctionComponent, useCallback } from "react";
import { color, size } from "../../common/styles";
import { View, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { AppMode } from "../../context/config";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { withNavigation } from "react-navigation";
import { NavigationProps } from "../../types";
import { AppName } from "./AppName";
import { AppText } from "./AppText";
import { useLogout } from "../../hooks/useLogout";

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
  const { logout } = useLogout();

  const handleLogout = useCallback((): void => {
    logout(navigation.dispatch);
  }, [logout, navigation.dispatch]);

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
