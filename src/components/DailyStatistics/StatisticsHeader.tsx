import React, { FunctionComponent } from "react";
import { size, fontSize } from "../../common/styles";
import { View, StyleSheet, TouchableOpacity, Keyboard } from "react-native";
import { AppMode } from "../../context/config";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { NavigationProps } from "../../types";
import { AppText } from "../Layout/AppText";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { useTheme } from "../../context/theme";
interface StatisticsHeader extends NavigationProps<"CustomerQuotaStack"> {
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
    // navigation.openDrawer();
    DrawerActions.openDrawer();
  };

  const onPressBack = (): void => {
    navigation.navigate({ key: "CollectCustomerDetailsScreen" });
  };

  const { theme } = useTheme();
  const { i18nt } = useTranslate();

  return (
    <View style={styles.appHeaderWrapper}>
      <TouchableOpacity style={styles.backButton} onPress={onPressBack}>
        <MaterialCommunityIcons
          style={styles.backIcon}
          name="chevron-left"
          size={size(4)}
          color={theme.statisticsScreen.headerBackButtonColor}
        />
        <AppText
          style={{
            ...styles.backText,
            color: theme.statisticsScreen.headerBackButtonColor,
          }}
          accessibilityLabel="statistics-header-back-button"
          testID="statistics-header-back-button"
          accessible={true}
        >
          {i18nt("statisticsScreen", "back")}
        </AppText>
      </TouchableOpacity>
      <AppText
        style={{
          ...styles.header,
          color: theme.statisticsScreen.headerTextColor,
        }}
        accessibilityLabel="statistics-header-title"
        testID="statistics-header-title"
        accessible={true}
      >
        {i18nt("statisticsScreen", "title")}
      </AppText>
      <TouchableOpacity onPress={onPressOpenDrawer}>
        <MaterialCommunityIcons
          name="menu"
          size={size(4)}
          color={theme.statisticsScreen.headerDrawerButtonColor}
        />
      </TouchableOpacity>
    </View>
  );
};

export const StatisticsHeader = StatisticsHeaderComponent;
