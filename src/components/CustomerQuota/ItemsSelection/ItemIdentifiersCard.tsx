import React, { FunctionComponent } from "react";
import { PolicyIdentifier } from "../../../types";
import { CartHook } from "../../../hooks/useCart/useCart";
import { ItemIdentifier } from "./ItemIdentifier";
import { View, StyleSheet } from "react-native";
import { size } from "../../../common/styles";

const styles = StyleSheet.create({
  content: {
    position: "relative",
    padding: size(2),
    width: 512,
    maxWidth: "100%"
  }
});

export const ItemIdentifiersCard: FunctionComponent<{
  identifiers: PolicyIdentifier[];
  updateCart: CartHook["updateCart"];
}> = ({ identifiers, updateCart }) => {
  // TODO: Do something with updateCart
  return (
    <View style={styles.content}>
      {identifiers.map((identifier, index) => (
        <ItemIdentifier key={index} label={identifier.label} />
      ))}
    </View>
  );
};
