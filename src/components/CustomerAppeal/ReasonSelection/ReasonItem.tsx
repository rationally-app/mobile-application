import { StyleSheet, View, TouchableOpacity } from "react-native";
import React, { FunctionComponent } from "react";
import { size, color } from "../../../common/styles";
import { AppText } from "../../Layout/AppText";

const styles = StyleSheet.create({
  reasonComponent: {
    margin: 0,
    marginBottom: size(2),
    marginHorizontal: -size(2),
    paddingVertical: 21,
    backgroundColor: color("grey", 10)
  },
  reasonLayout: {
    flexDirection: "row",
    marginHorizontal: 0,
    marginBottom: 0
  },
  reasonAlert: {
    marginLeft: 10,
    fontStyle: "italic",
    color: color("red", 50)
  }
});

export const ReasonItem: FunctionComponent<{
  description: string;
  alert?: string;
  isLast: boolean;
  onReasonSelection: (productName: string) => boolean;
}> = ({ description, alert, isLast, onReasonSelection }) => {
  return (
    <TouchableOpacity
      style={[styles.reasonComponent, isLast ? { marginBottom: 0 } : {}]}
      onPress={() => {
        onReasonSelection(description)
          ? console.warn(`${description} navigate to next screen`)
          : console.warn(`${description} throw alert`);
      }}
    >
      <View style={styles.reasonLayout}>
        <AppText>{description}</AppText>
        <AppText style={styles.reasonAlert}>{alert ?? ""}</AppText>
      </View>
    </TouchableOpacity>
  );
};
