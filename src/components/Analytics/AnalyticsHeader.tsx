import React, { FunctionComponent } from "react";
import { color, size, fontSize } from "../../common/styles";
import { View, StyleSheet, TouchableOpacity, Keyboard } from "react-native";
import { AppMode } from "../../context/config";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { withNavigation } from "react-navigation";
import { NavigationProps } from "../../types";
import { AppText } from "../Layout/AppText";

interface AnalyticsHeader extends NavigationProps {
  mode?: AppMode;
}

const styles = StyleSheet.create({
  appHeaderWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center"
  },
  header: {
    fontFamily: "brand-bold",
    fontSize: fontSize(3),
    color: "white",
    flexDirection: "row",
    textAlign: "center"
  }
});

export const AnalyticsHeaderComponent: FunctionComponent<AnalyticsHeader> = ({
  navigation
}) => {
  const onPressOpenDrawer = (): void => {
    Keyboard.dismiss();
    navigation.openDrawer();
  };

  const onPressBack = (): void => {
    navigation.navigate("CollectCustomerDetailsScreen");
  };

  return (
    <View style={styles.appHeaderWrapper}>
      <TouchableOpacity onPress={onPressBack}>
        <MaterialCommunityIcons
          name="arrow-left"
          size={size(4)}
          color={color("grey", 0)}
        />
      </TouchableOpacity>
      <AppText style={styles.header}>Analytics</AppText>
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

export const AnalyticsHeader = withNavigation(AnalyticsHeaderComponent);
