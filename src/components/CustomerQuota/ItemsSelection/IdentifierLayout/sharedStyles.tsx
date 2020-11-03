import { StyleSheet } from "react-native";
import { size } from "../../../../common/styles";

export const sharedStyles = StyleSheet.create({
  inputAndButtonWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    width: "100%",
    marginTop: size(2)
  },
  inputWrapper: {
    flex: 2
  },
  buttonWrapper: {
    flexShrink: 1
  }
});
