import { StyleSheet } from "react-native";
import { size, color, fontSize } from "../../common/styles";

export const sharedStyles = StyleSheet.create({
  resultWrapper: {
    padding: size(3)
  },
  successfulResultWrapper: {
    backgroundColor: color("green", 10),
    borderColor: color("green", 30)
  },
  failureResultWrapper: {
    paddingBottom: size(4),
    backgroundColor: color("red", 10),
    borderColor: color("red", 30)
  },
  ctaButtonsWrapper: {
    marginTop: size(5),
    paddingBottom: size(10)
  },
  buttonRow: {
    flexDirection: "row"
  },
  submitButton: { flex: 1 },
  emoji: {
    fontSize: fontSize(3),
    marginBottom: size(2),
    marginTop: size(1)
  },
  statusTitleWrapper: {
    marginBottom: size(2)
  },
  statusTitle: {
    fontSize: fontSize(3),
    lineHeight: 1.3 * fontSize(3),
    fontFamily: "inter-bold"
  }
});
