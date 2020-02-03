import { LinearGradient } from "expo-linear-gradient";
import React, { FunctionComponent } from "react";
import { color } from "../../common/styles";
import { ViewProps, View, Text } from "react-native";
import { useConfig, AppMode } from "../../common/hooks/useConfig";

interface TopBackground extends ViewProps {
  mode?: AppMode;
}

export const TopBackground: FunctionComponent<TopBackground> = ({
  style,
  mode = AppMode.production
}) => {
  const isProduction = mode === AppMode.production;
  const primaryColor = isProduction ? "blue" : "red";
  const secondaryColor = isProduction ? "green" : "orange";
  return (
    <LinearGradient
      style={[
        {
          backgroundColor: color(primaryColor, 50),
          width: "100%",
          height: "40%",
          maxHeight: 240,
          position: "absolute"
        },
        style
      ]}
      colors={[color(primaryColor, 50), color(secondaryColor, 30)]}
      start={[0.5, 0]}
      end={[0, 1.2]}
    />
  );
};
