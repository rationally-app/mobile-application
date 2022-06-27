import React, { FunctionComponent } from "react";
import { size } from "../../common/styles";
import { View, StyleSheet, TouchableOpacity, Keyboard } from "react-native";
import { AppMode } from "../../context/config";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { NavigationProps } from "../../types";
import { AppName } from "./AppName";
import { useTheme } from "../../context/theme";

interface AppHeader extends NavigationProps<"CampaignInitialisationScreen"> {
  mode?: AppMode;
}

const styles = StyleSheet.create({
  appHeaderWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  },
});

export const AppHeaderComponent: FunctionComponent<AppHeader> = ({
  mode = AppMode.production,
}) => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const onPressOpenDrawer = (): void => {
    Keyboard.dismiss();
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <View style={styles.appHeaderWrapper}>
      <AppName mode={mode} />
      <TouchableOpacity onPress={onPressOpenDrawer}>
        <MaterialCommunityIcons
          name="menu"
          size={size(4)}
          color={theme.drawer.openButtonColor}
          accessibilityLabel="drawer-nav-open-button"
          testID="drawer-nav-open-button"
          accessible={true}
        />
      </TouchableOpacity>
    </View>
  );
};

export const AppHeader = AppHeaderComponent;
