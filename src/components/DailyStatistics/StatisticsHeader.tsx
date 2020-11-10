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
    alignItems: "center",
  },
  backButton: {
    flexDirection: "row",
    alignSelf: "center",
    marginLeft: -size(2),
    marginRight: -size(0.5),
  },
  backIcon: {
    alignSelf: "center",
    marginRight: size(0.5),
  },
  backText: {
    color: "white",
    alignSelf: "center",
    fontSize: fontSize(0),
    marginRight: size(0.5),
    marginLeft: -size(1.5),
  },
  header: {
    fontFamily: "brand-bold",
    fontSize: fontSize(3),
    color: "white",
    flexDirection: "row",
    textAlign: "center",
    marginLeft: -size(1.5),
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
          style={styles.backIcon}
          name="chevron-left"
          size={size(4)}
          color={color("grey", 0)}
          accessibilityLabel="chevron-left"
          testID="chevron-left"
          accessible={true}
        />
        <AppText
          style={styles.backText}
          accessibilityLabel="back"
          testID="back"
          accessible={true}
        >
          Back
        </AppText>
      </TouchableOpacity>
      <AppText
        style={styles.header}
        accessibilityLabel="statistics"
        testID="statistics"
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
