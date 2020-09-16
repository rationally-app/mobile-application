import React, { FunctionComponent } from "react";
import { color, size, fontSize } from "../../common/styles";
import { View, StyleSheet, TouchableOpacity, Keyboard } from "react-native";
import { AppMode } from "../../context/config";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { withNavigation } from "react-navigation";
import { NavigationProps } from "../../types";
import { AppText } from "../Layout/AppText";

interface StatisticsHeader extends NavigationProps {
  mode?: AppMode;
}

const styles = StyleSheet.create({
  appHeaderWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center"
  },
  backButton: {
    flexDirection: "row",
    color: "white",
    marginLeft: -15,
    marginRight: -10
  },
  backText: {
    color: "white",
    marginTop: size(1),
    marginLeft: -10
  },
  header: {
    fontFamily: "brand-bold",
    fontSize: fontSize(3),
    color: "white",
    flexDirection: "row",
    textAlign: "center",
    marginLeft: -10
  }
});

export const StatisticsHeaderComponent: FunctionComponent<StatisticsHeader> = ({
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
      <TouchableOpacity style={styles.backButton} onPress={onPressBack}>
        <MaterialCommunityIcons
          name="chevron-left"
          size={size(5)}
          color={color("grey", 0)}
        />
        <AppText style={styles.backText}>Back</AppText>
      </TouchableOpacity>
      <AppText style={styles.header}>Statistics</AppText>
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

export const StatisticsHeader = withNavigation(StatisticsHeaderComponent);
