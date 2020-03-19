import React, { FunctionComponent, ReactNode } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  SafeAreaView
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { color, size, shadow } from "../../common/styles";

const styles = StyleSheet.create({
  safeAreaView: {
    backgroundColor: color("grey", 0)
  },
  header: {
    flexDirection: "row",
    height: size(5),
    width: "100%",
    alignItems: "stretch"
  },
  withShadow: {
    zIndex: 1,
    ...shadow(1)
  },
  headerBackButton: {
    paddingLeft: size(3),
    paddingRight: size(2),
    justifyContent: "center"
  }
});

export interface HeaderBackButton {
  onPress: () => void;
}

// Corresponding padding on the right header to center an element
// Calculated with HeaderBackButton's padding and font size
// The rendered component may have different offset, see below to have more accurate offset
// https://stackoverflow.com/questions/30203154/get-size-of-a-view-in-react-native
export const RIGHT_OFFSET = 24 * 3;

export const HeaderBackButton: FunctionComponent<HeaderBackButton> = ({
  onPress
}) => {
  return (
    <TouchableOpacity
      testID="header-back-button"
      onPress={onPress}
      style={styles.headerBackButton}
    >
      <Feather name="arrow-left" size={size(3)} color={color("grey", 100)} />
    </TouchableOpacity>
  );
};

export interface Header {
  goBack?: () => void;
  hasShadow?: boolean;
  children?: ReactNode;
  style?: ViewStyle;
}

export const Header: FunctionComponent<Header> = ({
  goBack,
  hasShadow = true,
  children,
  style
}) => (
  <SafeAreaView
    style={[styles.safeAreaView, hasShadow && styles.withShadow, style]}
  >
    <View testID="header-bar" style={[styles.header]}>
      {goBack ? <HeaderBackButton onPress={goBack} /> : null}
      {children}
    </View>
  </SafeAreaView>
);
