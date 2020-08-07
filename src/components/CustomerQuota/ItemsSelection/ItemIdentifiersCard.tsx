import React, { FunctionComponent, useEffect, useState } from "react";
import { IdentifierInput, PolicyIdentifier } from "../../../types";
import { CartHook, CartItem } from "../../../hooks/useCart/useCart";
import { ItemIdentifier } from "./ItemIdentifier";
import { View, StyleSheet } from "react-native";
import { size } from "../../../common/styles";

const styles = StyleSheet.create({
  content: {
    position: "relative",
    padding: size(2),
    // width: 512,
    width: "100%",
    maxWidth: "100%"
  }
});

export const ItemIdentifiersCard: FunctionComponent<{
  cartItem: CartItem;
  updateCart: CartHook["updateCart"];
  identifiers: PolicyIdentifier[];
}> = ({ cartItem, updateCart, identifiers }) => {
  const [identifierInputs, setIdentifierInputs] = useState<IdentifierInput[]>(
    cartItem.identifierInputs
  );

  const updateIdentifierValue = (index: number, value: string): void => {
    setIdentifierInputs([
      ...identifierInputs.slice(0, index),
      { ...identifierInputs[index], value },
      ...identifierInputs.slice(index + 1)
    ]);
  };

  useEffect(() => {
    updateCart(cartItem.category, cartItem.quantity, identifierInputs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identifierInputs]);

  return (
    <View style={styles.content}>
      {identifiers.map((identifier, index) => (
        <ItemIdentifier
          key={index}
          index={index}
          identifier={identifier}
          updateIdentifierValue={updateIdentifierValue}
        />
      ))}
    </View>
  );
};
