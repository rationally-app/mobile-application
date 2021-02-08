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

  let newIdentifiers = identifiers;
  const newCartItem = cartItem;

  if (
    identifiers.length > 0 &&
    cartItem.category.includes("lost") &&
    cartItem.descriptionAlert !== "*chargeable"
  ) {
    console.log("test");
    console.log(cartItem.category);
    console.log(identifiers);
    newIdentifiers = identifiers.filter(
      (identifier) => identifier.label != "Payment receipt number"
    );
    newCartItem.identifierInputs = newCartItem.identifierInputs.filter(
      (identifier) => identifier.label != "Payment receipt number"
    );
  }

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
      {newCartItem.maxQuantity > 0 && newIdentifiers.length > 0 && (
        <ItemIdentifiersCard
          cartItem={newCartItem}
          updateCart={updateCart}
          identifiers={newIdentifiers}
        />
      )}
    </View>
  );
};
