import { StyleSheet } from "react-native";
import { size, color, fontSize } from "../../common/styles";
import { lineHeight } from "../../common/styles/typography";

export const sharedStyles = StyleSheet.create({
  resultWrapper: {
    paddingLeft: size(2),
    paddingRight: size(2),
    paddingBottom: size(2),
  },
  successfulResultWrapper: {
    paddingTop: size(3),
    backgroundColor: color("green", 10),
    borderColor: color("green", 30),
  },
  failureResultWrapper: {
    paddingTop: size(3),
    paddingBottom: size(4),
    backgroundColor: color("red", 10),
    borderColor: color("red", 30),
  },
  ctaButtonsWrapper: {
    marginTop: size(5),
    paddingBottom: size(2),
  },
  buttonRow: {
    flexDirection: "column",
  },
  submitButton: { flex: 1 },
  icon: {
    fontSize: fontSize(6),
    lineHeight: lineHeight(6),
    marginBottom: size(2),
    marginTop: size(2),
  },
  statusTitleWrapper: {
    marginBottom: size(2),
  },
  statusTitle: {
    fontSize: fontSize(3),
    lineHeight: lineHeight(3),
    fontFamily: "brand-bold",
  },
});
