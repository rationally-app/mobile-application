import React, { FunctionComponent } from "react";
import { color, size, fontSize } from "../../common/styles";
import { View, StyleSheet, TouchableOpacity, Keyboard } from "react-native";
import { AppMode } from "../../context/config";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { withNavigation } from "react-navigation";
import { NavigationProps } from "../../types";
import { AppText } from "../Layout/AppText";
import { lineHeight } from "../../common/styles/typography";

interface StatisticsHeader extends NavigationProps {
  mode?: AppMode;
}

const styles = StyleSheet.create({
  appHeaderWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  },
  backButton: {
    flexDirection: "row",
  },
  backText: {
    color: "white",
    alignSelf: "center",
    fontSize: fontSize(0),
    lineHeight: lineHeight(0, false),
  },
  header: {
    fontFamily: "brand-bold",
    fontSize: fontSize(2),
    lineHeight: lineHeight(2),
    color: "white",
    textAlign: "center",
    marginTop: 2,
    marginRight: size(3),
  },
});

export const StatisticsHeaderComponent: FunctionComponent<StatisticsHeader> = ({
  navigation,
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
          size={size(3)}
          color={color("grey", 0)}
        />
        <AppText
          style={styles.backText}
          accessibilityLabel="statistics-header-back-button"
          testID="statistics-header-back-button"
          accessible={true}
        >
          Back
        </AppText>
      </TouchableOpacity>
      <AppText
        style={styles.header}
        accessibilityLabel="statistics-header-title"
        testID="statistics-header-title"
        accessible={true}
      >
        Statistics
      </AppText>
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
