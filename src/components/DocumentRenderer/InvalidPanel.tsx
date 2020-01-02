import React, { FunctionComponent } from "react";
import { StyleSheet, View, Text } from "react-native";
import {
  size,
  fontSize,
  borderRadius,
  color,
  shadow
} from "../../common/styles";

const styles = StyleSheet.create({
  panel: {
    padding: size(3),
    borderRadius: borderRadius(2),
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: color("red", 20),
    borderTopWidth: 0,
    backgroundColor: color("grey", 0),
    ...shadow(2, color("red", 30))
  },
  panelTopBar: {
    borderRadius: borderRadius(2),
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: color("red", 30),
    height: size(1)
  },
  panelTitle: {
    fontSize: fontSize(-2),
    fontWeight: "bold",
    paddingBottom: size(1.5)
  },
  panelContent: {
    fontSize: fontSize(-1)
  }
});

export const InvalidPanel: FunctionComponent = () => {
  return (
    <View testID="invalid-panel">
      <View style={styles.panelTopBar} />
      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Important</Text>
        <Text style={styles.panelContent}>
          This document is invalid and cannot be shared. Please contact the
          issuer for more information.
        </Text>
      </View>
    </View>
  );
};
