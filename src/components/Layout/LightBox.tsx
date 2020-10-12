import React, { FunctionComponent, ReactElement } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { size } from "../../common/styles";

const styles = StyleSheet.create({
  lightBoxWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center"
  },
  lightBoxBorder: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 1.0)"
  }
});

interface LightBox {
  width: number;
  height: number;
  label?: ReactElement;
}

/**
 * A full-screen light box component with a focused component in the middle of the screen.
 * @param width The width of the focused component
 * @param height The height of the focused component
 * @param label A component that will appear above the focused component
 */
export const LightBox: FunctionComponent<LightBox> = ({
  width,
  height,
  label,
  children
}) => {
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const horizontalBorderWidth = (windowWidth - width) / 2;
  const verticalBorderHeight = (windowHeight - height) / 2;
  return (
    <View
      style={{
        ...styles.lightBoxWrapper,
        width: windowWidth,
        height: windowHeight
      }}
    >
      <View
        style={{
          ...styles.lightBoxBorder,
          top: 0,
          width,
          height: verticalBorderHeight,
          alignItems: "center",
          justifyContent: "flex-end"
        }}
      >
        {label && <View style={{ marginBottom: size(4) }}>{label}</View>}
      </View>
      <View
        style={{
          ...styles.lightBoxBorder,
          left: 0,
          width: horizontalBorderWidth,
          height: windowHeight
        }}
      />
      {children}
      <View
        style={{
          ...styles.lightBoxBorder,
          right: 0,
          width: horizontalBorderWidth,
          height: windowHeight
        }}
      />
      <View
        style={{
          ...styles.lightBoxBorder,
          bottom: 0,
          width,
          height: verticalBorderHeight
        }}
      />
    </View>
  );
};
