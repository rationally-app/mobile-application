import { LinearGradient } from "expo-linear-gradient";
import React, { FunctionComponent } from "react";
import { ViewProps } from "react-native";
import { AppMode } from "../../context/config";
import { useTheme } from "../../context/theme";

interface TopBackground extends ViewProps {
  mode?: AppMode;
}

export const TopBackground: FunctionComponent<TopBackground> = ({
  style,
  mode = AppMode.production,
}) => {
  const { theme } = useTheme();

  const isProduction = mode === AppMode.production;
  const primaryColor = isProduction
    ? theme.topBackground.production.primaryColor
    : theme.topBackground.staging.primaryColor;
  const secondaryColor = isProduction
    ? theme.topBackground.production.secondaryColor
    : theme.topBackground.staging.secondaryColor;
  return (
    <LinearGradient
      style={[
        {
          backgroundColor: primaryColor,
          width: "100%",
          height: "40%",
          maxHeight: 360,
          position: "absolute",
        },
        style,
      ]}
      colors={[primaryColor, secondaryColor]}
      start={[0.5, 0]}
      end={[-0.5, 1.8]}
    />
  );
};
