import { StyleSheet } from "react-native";
import { color, size, fontSize } from "../../../common/styles";
import { lineHeight } from "../../../common/styles/typography";

export const styles = StyleSheet.create({
  wrapper: {
    marginTop: size(2),
    marginBottom: size(2),
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  itemHeader: {
    lineHeight: 1.5 * fontSize(0),
    fontFamily: "brand-bold",
  },
  itemSubheader: {
    fontSize: fontSize(-1),
    lineHeight: lineHeight(-1),
    fontFamily: "brand-bold",
  },
  itemDetailWrapper: {
    flexDirection: "row",
  },
  itemDetailBorder: {
    borderLeftWidth: 1,
    borderLeftColor: color("grey", 30),
    marginLeft: size(1),
    marginRight: size(1),
  },
  itemDetail: {
    fontSize: fontSize(-1),
    lineHeight: lineHeight(-1),
  },
  appealLabel: {
    fontSize: fontSize(-1),
    color: color("red", 60),
    fontFamily: "brand-italic",
  },
  appealButtonText: {
    marginTop: size(1),
    marginBottom: 0,
    fontFamily: "brand-bold",
    fontSize: size(2),
  },
});
