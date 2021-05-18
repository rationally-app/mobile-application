import { StyleSheet } from "react-native";
import { color, size, fontSize } from "../../common/styles";

export const sharedStyles = StyleSheet.create({
  scanButtonWrapper: {
    marginTop: size(3),
    marginBottom: size(6),
  },
  horizontalRule: {
    borderBottomColor: color("grey", 30),
    marginHorizontal: -size(3),
    borderBottomWidth: 1,
  },
  orWrapper: {
    position: "absolute",
    top: -fontSize(0),
    alignSelf: "center",
    backgroundColor: color("grey", 0),
    padding: size(1),
  },
  orText: {
    fontSize: fontSize(-1),
    fontFamily: "brand-bold",
  },
});
