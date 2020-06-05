import React, { FunctionComponent, useState, useEffect } from "react";
import { PolicyIdentifier } from "../../../types";
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
  const [identifierValues, setIdentifierValues] = useState<string[]>(
    identifiers.map(() => "")
  );

  const updateIdentifierValue = (index: number, value: string): void =>
    setIdentifierValues([
      ...identifierValues.slice(0, index),
      value,
      ...identifierValues.slice(index + 1)
    ]);

  useEffect(() => {
    updateCart(
      cartItem.category,
      cartItem.quantity,
      !identifierValues.some(value => !value),
      identifierValues
    );
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
