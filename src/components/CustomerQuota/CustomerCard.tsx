import React, { FunctionComponent } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { Card } from "../Layout/Card";
import { AppText } from "../Layout/AppText";
import { Feather } from "@expo/vector-icons";
import { size, color, borderRadius, fontSize } from "../../common/styles";

const styles = StyleSheet.create({
  header: {
    borderTopLeftRadius: borderRadius(4),
    borderTopRightRadius: borderRadius(4),
    paddingHorizontal: size(3),
    paddingVertical: size(2),
    backgroundColor: color("blue-green", 40),
    flexDirection: "row",
    alignItems: "center"
  },
  headerText: {
    marginLeft: size(1.5)
  },
  nricLabel: {
    color: color("grey", 0),
    fontSize: fontSize(-2)
  },
  nricText: {
    color: color("grey", 0),
    fontSize: fontSize(1),
    fontFamily: "inter-bold"
  },
  childrenWrapper: {
    overflow: "hidden",
    borderBottomLeftRadius: borderRadius(4),
    borderBottomRightRadius: borderRadius(4)
  }
});

export const CustomerCard: FunctionComponent<{
  nric: string;
  headerBackgroundColor?: ViewStyle["backgroundColor"];
}> = ({ nric, headerBackgroundColor, children }) => (
  <Card
    style={{
      paddingTop: 0,
      paddingBottom: 0,
      paddingHorizontal: 0
    }}
  >
    <View
      style={[
        styles.header,
        headerBackgroundColor ? { backgroundColor: headerBackgroundColor } : {}
      ]}
    >
      <Feather name="user" size={size(3)} color={color("grey", 0)} />
      <View style={styles.headerText}>
        <AppText style={styles.nricLabel}>Customer NRIC</AppText>
        <AppText style={styles.nricText}>{nric}</AppText>
      </View>
    </View>
    <View style={styles.childrenWrapper}>{children}</View>
  </Card>
);
