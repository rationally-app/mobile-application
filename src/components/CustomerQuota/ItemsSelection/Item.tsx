import { PolicyIdentifier } from "../../../types";
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

/**
 * Check if the campaign contains tt-token
 * to indicate pod campaign
 *
 * @param cartItemCategory category of item
 */
const isPodCampaign = (cartItemCategory: string): boolean =>
  cartItemCategory.includes("tt-token");

/**
 * Check if pod is chargeable
 *
 * @param identifiers policy identifiers
 * @param cartItem policy cart item
 */
const isPodChargeable = (
  identifiers: PolicyIdentifier[],
  cartItem: CartItem
): boolean =>
  identifiers.length > 0 &&
  cartItem.category.includes("tt-token-lost") &&
  cartItem.descriptionAlert === "*chargeable";

/**
 * Filters out the payment receipt identifier if not required
 * which happens when pod is not chargeable
 * Shape of identifiers and cartItem.identifierInputs are slightly different and
 * hence require to filter separately
 *
 * @param identifiers identifiers that can be modified
 * @param cartItem cartItem containing identifiers that can be modified
 */
const removePaymentReceiptField = (
  identifiers: PolicyIdentifier[],
  cartItem: CartItem
): {
  newIdentifiers: PolicyIdentifier[];
  newCartItem: CartItem;
} => {
  identifiers = identifiers.filter(
    (identifier: { label: string }) =>
      identifier.label != "Payment receipt number"
  );
  cartItem.identifierInputs = cartItem.identifierInputs.filter(
    (identifier) => identifier.label != "Payment receipt number"
  );

  return { newIdentifiers: identifiers, newCartItem: cartItem };
};

export const Item: FunctionComponent<{
  ids: string[];
  hasAddonToggle: boolean;
  cartItem: CartItem;
  updateCart: CartHook["updateCart"];
}> = ({ ids, hasAddonToggle, cartItem, updateCart }) => {
  const { getProduct } = useContext(ProductContext);
  const identifiers = getProduct(cartItem.category)?.identifiers || [];

  let newIdentifiers = identifiers;
  let newCartItem = cartItem;

  // Conditional check if receipt field should be removed,
  // only applied for Pod distribution
  if (isPodCampaign(cartItem.category)) {
    if (!isPodChargeable(identifiers, cartItem)) {
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
          hasAddonToggle={hasAddonToggle}
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
