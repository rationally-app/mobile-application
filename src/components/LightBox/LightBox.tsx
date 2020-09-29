import React, { FunctionComponent } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { color } from "../../common/styles";

const styles = StyleSheet.create({
  lightBoxWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center"
  },
  lightBoxBorder: {
    position: "absolute",
    backgroundColor: color("grey", 100),
    opacity: 0.6
  }
});

interface LightBox {
  width: number;
  height: number;
}

/**
 * A full-screen light box component with a focused component in the middle of the screen.
 * @param width The width of the focused component
 * @param height The height of the focused component
 */
export const LightBox: FunctionComponent<LightBox> = ({
  width,
  height,
  children
}) => {
  const wrapperWidth = Dimensions.get("window").width;
  const wrapperHeight = Dimensions.get("window").height;

  const borderSideWidth = (wrapperWidth - width) / 2;
  const borderTopBottomHeight = (wrapperHeight - height) / 2;

  return (
    <View
      style={{
        ...styles.lightBoxWrapper,
        width: wrapperWidth,
        height: wrapperHeight
      }}
    >
      <View
        style={{
          ...styles.lightBoxBorder,
          top: 0,
          width: "100%",
          height: borderTopBottomHeight
        }}
      />
      <View
        style={{
          ...styles.lightBoxBorder,
          left: 0,
          width: borderSideWidth,
          height
        }}
      />
      {children}
      <View
        style={{
          ...styles.lightBoxBorder,
          right: 0,
          width: borderSideWidth,
          height
        }}
      />
      <View
        style={{
          ...styles.lightBoxBorder,
          bottom: 0,
          width: "100%",
          height: borderTopBottomHeight
        }}
      />
    </View>
  );
};
