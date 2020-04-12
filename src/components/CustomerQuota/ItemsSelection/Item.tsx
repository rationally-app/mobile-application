import { ItemNoQuota } from "./ItemNoQuota";
import { ItemCheckbox } from "./ItemCheckbox";
import { ItemStepper } from "./ItemStepper";
import { StyleSheet, View } from "react-native";
import React, { FunctionComponent } from "react";
import { CartHook, CartItem } from "../../../hooks/useCart/useCart";
import { size } from "../../../common/styles";

const styles = StyleSheet.create({
  cartItemComponent: {
    marginBottom: size(0.5),
    marginHorizontal: -size(2)
  }
});

export const Item: FunctionComponent<{
  cartItem: CartItem;
  updateCart: CartHook["updateCart"];
}> = ({ cartItem, updateCart }) => (
  <View style={styles.cartItemComponent}>
    {cartItem.maxQuantity === 0 ? (
      <ItemNoQuota cartItem={cartItem} />
    ) : cartItem.maxQuantity === 1 ? (
      <ItemCheckbox cartItem={cartItem} updateCart={updateCart} />
    ) : (
      <ItemStepper cartItem={cartItem} updateCart={updateCart} />
    )}
  </View>
);
