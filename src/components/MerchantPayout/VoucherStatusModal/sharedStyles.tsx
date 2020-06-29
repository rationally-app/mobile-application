import { StyleSheet } from "react-native";
import { size, fontSize } from "../../../common/styles";

export const sharedStyles = StyleSheet.create({
  statusTitleWrapper: {
    marginBottom: size(2)
  },
  statusTitle: {
    fontSize: fontSize(3),
    lineHeight: 1.3 * fontSize(3),
    fontFamily: "brand-bold"
  }
});
