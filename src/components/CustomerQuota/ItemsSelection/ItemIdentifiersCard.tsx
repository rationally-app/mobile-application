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
  const [identifiersState, setIdentifiersState] = useState({});

  const updateIdentifierState = (label: string, isFilledIn: boolean): void =>
    setIdentifiersState({ ...identifiersState, [label]: isFilledIn });

  useEffect(() => {
    const isAllIdentifiersFilled =
      Object.keys(identifiersState).length === identifiers.length &&
      Object.values(identifiersState).reduce(
        (accummulator, current) => accummulator && current
      );
    updateCart(cartItem.category, cartItem.quantity, !!isAllIdentifiersFilled);
  });

  return (
    <View style={styles.content}>
      {identifiers.map((identifier, index) => (
        <ItemIdentifier
          key={index}
          label={identifier.label}
          updateIdentifierState={updateIdentifierState}
        />
      ))}
    </View>
  );
};
