import { StyleSheet } from "react-native";
import { fontSize, size, color } from "../../../common/styles";

export const sharedStyles = StyleSheet.create({
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  itemHeaderText: {
    fontFamily: "brand-bold",
  },
  quantityByIdText: {
    fontSize: fontSize(-1),
  },
  quantitiesWrapper: {
    flexDirection: "row",
    marginTop: size(0.5),
  },
  quantitiesBorder: {
    borderLeftWidth: 1,
    borderLeftColor: color("grey", 30),
    marginLeft: size(1),
    marginRight: size(1),
  },
});
