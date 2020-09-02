import React, { FunctionComponent } from "react";
import { color, size } from "../../common/styles";
import { View, StyleSheet, TouchableOpacity, Keyboard } from "react-native";
import { AppMode } from "../../context/config";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AppName } from "./AppName";
import { useNavigation, DrawerActions } from "@react-navigation/native";

interface AppHeader {
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

export const AppHeader: FunctionComponent<AppHeader> = ({
  mode = AppMode.production
}) => {
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
          color={color("grey", 0)}
        />
      </TouchableOpacity>
    </View>
  );
};
