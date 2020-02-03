import { LinearGradient } from "expo-linear-gradient";
import React, { FunctionComponent } from "react";
import { color } from "../../common/styles";
import { ViewProps } from "react-native";
import { AppMode } from "../../common/hooks/useConfig";

interface TopBackground extends ViewProps {
  mode?: AppMode;
}

export const TopBackground: FunctionComponent<TopBackground> = ({
  style,
  mode = AppMode.production
}) => {
  const isProduction = mode === AppMode.production;
  const primaryColor = isProduction ? color("blue", 50) : color("red", 50);
  const secondaryColor = isProduction
    ? color("green", 30)
    : color("orange", 30);
  return (
    <LinearGradient
      style={[
        {
          backgroundColor: primaryColor,
          width: "100%",
          height: "40%",
          maxHeight: 240,
          position: "absolute"
        },
        style
      ]}
      colors={[primaryColor, secondaryColor]}
      start={[0.5, 0]}
      end={[0, 1.2]}
    />
  );
};
