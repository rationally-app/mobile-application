import { StyleSheet } from "react-native";
import { size, color, fontSize } from "../../common/styles";

export const sharedStyles = StyleSheet.create({
  resultWrapper: {
    paddingLeft: size(2),
    paddingRight: size(2),
    paddingBottom: size(2),
  },
  successfulResultWrapper: {
    paddingTop: size(3),
    borderColor: color("green", 30),
  },
  failureResultWrapper: {
    paddingTop: size(3),
    paddingBottom: size(4),
    borderColor: color("red", 30),
  },
  ctaButtonsWrapper: {
    marginTop: size(5),
    paddingBottom: size(2),
  },
  buttonRow: {
    flexDirection: "row",
  },
  submitButton: { flex: 1 },
  icon: {
    fontSize: fontSize(6),
    marginBottom: size(2),
    marginTop: size(2),
  },
  statusTitleWrapper: {
    marginBottom: size(2),
  },
  statusTitle: {
    fontSize: fontSize(3),
    lineHeight: 1.3 * fontSize(3),
    fontFamily: "brand-bold",
  },
});
