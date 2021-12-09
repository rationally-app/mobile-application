import { StyleSheet, View } from "react-native";
import React, { FunctionComponent, useContext } from "react";
import { ItemCheckbox } from "./ItemCheckbox";
import { ItemIdentifiersCard } from "./ItemIdentifiersCard";
import { ItemNoQuota } from "./ItemNoQuota";
import { ItemStepper } from "./ItemStepper";
import {
  isPodCampaign,
  isPodChargeable,
  removePaymentReceiptField,
} from "../utils";
import { CartHook, CartItem } from "../../../hooks/useCart/useCart";
import { size } from "../../../common/styles";
import { ProductContext } from "../../../context/products";
import { IdentificationContext } from "../../../context/identification";

const styles = StyleSheet.create({
  cartItemComponent: {
    marginBottom: size(0.5),
    marginHorizontal: -size(2),
  },
});

export const Item: FunctionComponent<{
  ids: string[];
  addonToggleItem: boolean;
  cartItem: CartItem;
  updateCart: CartHook["updateCart"];
}> = ({ ids, addonToggleItem, cartItem, updateCart }) => {
  const { selectedIdType } = useContext(IdentificationContext);
  const { getProduct } = useContext(ProductContext);
  const identifiers = getProduct(cartItem.category)?.identifiers || [];

  let newIdentifiers = identifiers;
  let newCartItem = cartItem;

  // Conditional check if receipt field should be removed,
  // only applied for Pod distribution
  if (isPodCampaign(cartItem.category)) {
    // Pod distribution can only redeem for 1 user at a time
    if (!isPodChargeable(selectedIdType.validation, identifiers, cartItem)) {
      ({ newIdentifiers, newCartItem } = removePaymentReceiptField(
        identifiers,
        cartItem
      ));
    }
  }

  return (
    <View style={styles.cartItemComponent}>
      {cartItem.maxQuantity === 0 ? (
        <ItemNoQuota cartItem={cartItem} />
      ) : cartItem.maxQuantity === 1 ? (
        <ItemCheckbox
          ids={ids}
          addonToggleItem={addonToggleItem}
          cartItem={cartItem}
          updateCart={updateCart}
        />
      ) : (
        <ItemStepper ids={ids} cartItem={cartItem} updateCart={updateCart} />
      )}
      {cartItem.maxQuantity > 0 && identifiers.length > 0 && (
        <ItemIdentifiersCard
          cartItem={newCartItem}
          updateCart={updateCart}
          identifiers={newIdentifiers}
        />
      )}
    </View>
  );
};
