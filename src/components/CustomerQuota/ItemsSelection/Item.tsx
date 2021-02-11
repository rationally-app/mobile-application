import { ItemNoQuota } from "./ItemNoQuota";
import { ItemCheckbox } from "./ItemCheckbox";
import { ItemStepper } from "./ItemStepper";
import { StyleSheet, View } from "react-native";
import React, { FunctionComponent, useContext } from "react";
import { CartHook, CartItem } from "../../../hooks/useCart/useCart";
import { size } from "../../../common/styles";
import { ProductContext } from "../../../context/products";
import { ItemIdentifiersCard } from "./ItemIdentifiersCard";

const styles = StyleSheet.create({
  cartItemComponent: {
    marginBottom: size(0.5),
    marginHorizontal: -size(2),
  },
});

export const Item: FunctionComponent<{
  ids: string[];
  isChargeable: boolean;
  cartItem: CartItem;
  updateCart: CartHook["updateCart"];
}> = ({ ids, isChargeable, cartItem, updateCart }) => {
  const { getProduct } = useContext(ProductContext);
  const identifiers = getProduct(cartItem.category)?.identifiers || [];

  return (
    <View style={styles.cartItemComponent}>
      {cartItem.maxQuantity === 0 ? (
        <ItemNoQuota cartItem={cartItem} />
      ) : cartItem.maxQuantity === 1 ? (
        <ItemCheckbox
          ids={ids}
          isChargeable={isChargeable}
          cartItem={cartItem}
          updateCart={updateCart}
        />
      ) : (
        <ItemStepper
          ids={ids}
          isChargeable={isChargeable}
          cartItem={cartItem}
          updateCart={updateCart}
        />
      )}
      {cartItem.maxQuantity > 0 && identifiers.length > 0 && (
        <ItemIdentifiersCard
          cartItem={cartItem}
          updateCart={updateCart}
          identifiers={identifiers}
        />
      )}
    </View>
  );
};
