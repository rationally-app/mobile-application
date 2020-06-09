import React, { FunctionComponent } from "react";
import { PolicyIdentifierInput } from "../../../types";
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
  identifierInputs: PolicyIdentifierInput[];
  setIdentifierInputs: (input: PolicyIdentifierInput[]) => void;
  updateCart: CartHook["updateCart"];
}> = ({ cartItem, identifierInputs, setIdentifierInputs, updateCart }) => {
  const updateIdentifierValue = (index: number, value: string): void => {
    setIdentifierInputs([
      ...identifierInputs.slice(0, index),
      { ...identifierInputs[index], value },
      ...identifierInputs.slice(index + 1)
    ]);
    updateCart(cartItem.category, cartItem.quantity, identifierInputs);
  };

  return (
    <View style={styles.content}>
      {identifierInputs.map((identifier, index) => (
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
