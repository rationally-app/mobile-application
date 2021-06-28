import { StyleSheet, View, TouchableOpacity } from "react-native";
import React, { FunctionComponent } from "react";
import { size, color } from "../../../common/styles";
import { AppText } from "../../Layout/AppText";
import { useTranslate } from "../../../hooks/useTranslate/useTranslate";

const styles = StyleSheet.create({
  reasonComponent: {
    margin: 0,
    marginBottom: size(2),
    marginHorizontal: -size(3),
    paddingVertical: size(2.5),
    backgroundColor: color("grey", 10),
  },
  reasonLayout: {
    flexDirection: "row",
    marginHorizontal: size(3),
    marginBottom: 0,
  },
  reasonAlert: {
    marginLeft: size(1.5),
    fontFamily: "brand-italic",
    color: color("red", 50),
  },
});

export const ReasonItem: FunctionComponent<{
  category: string;
  description: string;
  descriptionAlert?: string;
  isLast: boolean;
  onReasonSelection: (productCategory: string) => void;
}> = ({
  category,
  description,
  descriptionAlert,
  isLast,
  onReasonSelection,
}) => {
  const { c13nt } = useTranslate();
  return (
    <TouchableOpacity
      style={[styles.reasonComponent, isLast ? { marginBottom: 0 } : {}]}
      onPress={() => {
        onReasonSelection(category);
      }}
    >
      <View style={styles.reasonLayout}>
        <AppText>{c13nt(description)}</AppText>
        <AppText style={styles.reasonAlert}>{`${c13nt(
          descriptionAlert
        )}`}</AppText>
      </View>
    </TouchableOpacity>
  );
};
