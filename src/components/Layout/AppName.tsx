import React, { FunctionComponent } from "react";
import { Text } from "react-native";
import { color, fontSize } from "../../common/styles";

export const AppName: FunctionComponent = () => (
  <Text
    style={{
      color: color("grey", 0),
      fontWeight: "bold",
      fontSize: fontSize(4)
    }}
  >
    MaskEnough
  </Text>
);
