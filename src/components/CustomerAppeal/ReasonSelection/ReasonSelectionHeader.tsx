import { StyleSheet, View } from "react-native";
import React, { FunctionComponent } from "react";
import { size, fontSize } from "../../../common/styles";
import { AppText } from "../../Layout/AppText";

const styles = StyleSheet.create({
  reasonSelectionComponent: {
    marginBottom: size(0.5),
    marginHorizontal: -size(2),
  },
  reasonSelectionDescription: {
    fontFamily: "brand-bold",
    fontSize: fontSize(1),
  },
});

export const ReasonSelectionHeader: FunctionComponent<{
  title: string;
}> = ({ title }) => {
  return (
    <View style={styles.reasonSelectionComponent}>
      <AppText style={styles.reasonSelectionDescription}>{title}</AppText>
    </View>
  );
};
