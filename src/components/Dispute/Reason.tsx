import { StyleSheet, View } from "react-native";
import React, { FunctionComponent } from "react";
import { size, color } from "../../common/styles";
import { AppText } from "../Layout/AppText";
import { reduce } from "lodash";

const styles = StyleSheet.create({
  reasonComponent: {
    marginBottom: size(2),
    marginHorizontal: -size(2),
    paddingVertical: 21,
    backgroundColor: color("grey", 10)
  }
});

export const Reason: FunctionComponent<{
  description: string;
  isLast: boolean;
}> = ({ description, isLast }) => {
  return (
    <View style={[styles.reasonComponent, isLast ? { marginBottom: 0 } : {}]}>
      <AppText>{description}</AppText>
    </View>
  );
};
