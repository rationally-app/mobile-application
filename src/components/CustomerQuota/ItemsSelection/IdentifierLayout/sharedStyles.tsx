import { StyleSheet } from "react-native";
import { size } from "../../../../common/styles";
import { lineHeight } from "../../../../common/styles/typography";

export const sharedStyles = StyleSheet.create({
  inputAndButtonWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    width: "100%",
    marginTop: size(2),
  },
  inputWrapper: {
    flex: 2,
  },
  buttonWrapper: {
    flexShrink: 1,
    lineHeight: lineHeight(0),
  },
});
