import { StyleSheet } from "react-native";
import { size, fontSize } from "../../../common/styles";
import { lineHeight } from "../../../common/styles/typography";

export const sharedStyles = StyleSheet.create({
  statusTitleWrapper: {
    marginBottom: size(2),
  },
  statusTitle: {
    fontSize: fontSize(3),
    lineHeight: lineHeight(3),
    fontFamily: "brand-bold",
  },
});
