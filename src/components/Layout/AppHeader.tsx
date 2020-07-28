import React, { FunctionComponent } from "react";
import { color, size } from "../../common/styles";
import { View, StyleSheet, TouchableOpacity, Keyboard } from "react-native";
import { AppMode } from "../../context/config";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { withNavigation } from "react-navigation";
import { NavigationProps } from "../../types";
import { AppName } from "./AppName";

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
  const onPressOpenDrawer = (): void => {
    Keyboard.dismiss();
    navigation.openDrawer();
  };

  return (
    <View style={styles.appHeaderWrapper}>
      <AppName mode={mode} />
      <TouchableOpacity onPress={onPressOpenDrawer}>
        <MaterialCommunityIcons
          name="menu"
          size={size(4)}
          color={color("grey", 0)}
        />
      </TouchableOpacity>
    </View>
  );
};

export const AppHeader = withNavigation(AppHeaderComponent);
