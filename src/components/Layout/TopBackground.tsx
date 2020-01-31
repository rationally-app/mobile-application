import { LinearGradient } from "expo-linear-gradient";
import React, { FunctionComponent } from "react";
import { color } from "../../common/styles";
import { ViewProps } from "react-native";

export const TopBackground: FunctionComponent<ViewProps> = ({ style }) => (
  <LinearGradient
    style={[
      {
        backgroundColor: color("blue", 50),
        width: "100%",
        height: "40%",
        maxHeight: 240,
        position: "absolute"
      },
      style
    ]}
    colors={[color("blue", 50), color("green", 30)]}
    start={[0.5, 0]}
    end={[0, 1.2]}
  />
);
