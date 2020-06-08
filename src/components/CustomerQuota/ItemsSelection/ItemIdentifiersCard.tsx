import React, { FunctionComponent, useState, useEffect } from "react";
import { PolicyIdentifier, PolicyIdentifierInput } from "../../../types";
import { CartHook, CartItem } from "../../../hooks/useCart/useCart";
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
  cartItem: CartItem;
  identifiers: PolicyIdentifier[];
  updateCart: CartHook["updateCart"];
}> = ({ cartItem, identifiers, updateCart }) => {
  const [identifierInputs, setIdentifierInputs] = useState<
    PolicyIdentifierInput[]
  >(identifiers.map(identifier => ({ label: identifier.label, value: "" })));

  const updateIdentifierValue = (index: number, value: string): void =>
    setIdentifierInputs([
      ...identifierInputs.slice(0, index),
      { ...identifierInputs[index], value },
      ...identifierInputs.slice(index + 1)
    ]);

  useEffect(() => {
    updateCart(cartItem.category, cartItem.quantity, identifierInputs);
  });

  return (
    <View style={styles.content}>
      {identifiers.map((identifier, index) => (
        <ItemIdentifier
          key={index}
          index={index}
          label={identifier.label}
          updateIdentifierValue={updateIdentifierValue}
        />
      ))}
    </View>
  );
};
