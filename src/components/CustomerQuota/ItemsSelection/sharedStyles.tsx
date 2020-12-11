import { StyleSheet } from "react-native";
import { size, fontSize, color } from "../../../common/styles";
import { lineHeight } from "../../../common/styles/typography";

export const sharedStyles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: size(10),
    borderWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    paddingHorizontal: size(2),
    paddingVertical: size(1.5),
  },
  wrapperDefault: {
    backgroundColor: color("grey", 10),
    borderColor: color("grey", 20),
  },
  wrapperHighlighted: {
    backgroundColor: color("green", 10),
    borderColor: color("green", 40),
  },
  contentWrapper: {
    marginRight: size(1.5),
    flexShrink: 1,
  },
  maxQuantityLabel: {
    marginTop: 2,
    fontFamily: "brand-regular",
    fontSize: fontSize(-2),
    lineHeight: lineHeight(-2),
  },
});
