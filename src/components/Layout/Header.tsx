import React, { FunctionComponent, ReactNode } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { VERY_LIGHT, DARK } from "../../common/colors";

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    height: 56,
    width: "100%",
    marginBottom: 5,
    alignItems: "center"
  },
  borderBottom: {
    borderBottomWidth: 2,
    borderStyle: "solid",
    borderColor: VERY_LIGHT
  },
  headerBackButton: {
    paddingLeft: 24,
    paddingRight: 24,
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
      <Ionicons name="md-arrow-round-back" size={24} color={DARK} />
    </TouchableOpacity>
  );
};

export interface Header {
  goBack?: () => void;
  hasBorder?: boolean;
  children?: ReactNode;
}

export const Header: FunctionComponent<Header> = ({
  goBack,
  hasBorder = true,
  children
}) => (
  <View
    testID="header-bar"
    style={[styles.header, hasBorder && styles.borderBottom]}
  >
    {goBack ? <HeaderBackButton onPress={goBack} /> : null}
    {children}
  </View>
);
