import { StyleSheet } from "react-native";
import { fontSize, size, color } from "../../common/styles";
import { lineHeight } from "../../common/styles/typography";

export const sharedStyles = StyleSheet.create({
  emoji: {
    fontSize: fontSize(6),
  },
  heading: {
    marginTop: size(1),
    fontFamily: "brand-bold",
    fontSize: fontSize(4),
    lineHeight: lineHeight(4, true),
  },
  description: {
    marginTop: size(2),
    fontSize: fontSize(2),
  },
  additionalInfo: {
    marginTop: size(2),
    fontFamily: "brand-italic",
    fontSize: fontSize(-1),
    color: color("grey", 40),
  },
  emailLink: {
    fontFamily: "brand-italic",
    fontSize: fontSize(-1),
    textDecorationLine: "underline",
    color: color("blue", 40),
  },
  ctaButton: {
    alignSelf: "flex-start",
    marginTop: size(5),
  },
});
