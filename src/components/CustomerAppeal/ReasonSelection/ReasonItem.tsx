import { StyleSheet, View, TouchableOpacity } from "react-native";
import React, { FunctionComponent } from "react";
import { size, color } from "../../../common/styles";
import { AppText } from "../../Layout/AppText";

const styles = StyleSheet.create({
  reasonComponent: {
    margin: 0,
    marginBottom: size(2),
    marginHorizontal: -size(3),
    paddingVertical: size(2.5),
    backgroundColor: color("grey", 10)
  },
  reasonLayout: {
    flexDirection: "row",
    marginHorizontal: size(3),
    marginBottom: 0
  },
  reasonAlert: {
    marginLeft: size(1.5),
    fontFamily: "brand-italic",
    color: color("red", 50)
  }
});

export const ReasonItem: FunctionComponent<{
  description: string;
  descriptionAlert?: string;
  isLast: boolean;
  onReasonSelection: (productName: string) => void;
}> = ({ description, descriptionAlert, isLast, onReasonSelection }) => {
  return (
    <TouchableOpacity
      style={[styles.reasonComponent, isLast ? { marginBottom: 0 } : {}]}
      onPress={() => {
        onReasonSelection(description);
      }}
    >
      <View style={styles.reasonLayout}>
        <AppText>{description}</AppText>
        <AppText style={styles.reasonAlert}>{descriptionAlert ?? ""}</AppText>
      </View>
    </TouchableOpacity>
  );
};
