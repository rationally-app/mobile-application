import React, { FunctionComponent } from "react";
import { Checkbox } from "../../Layout/Checkbox";
import { ItemContent } from "./ItemContent";
import { CartItem, CartHook } from "../../../hooks/useCart/useCart";
import { useProductContext } from "../../../context/products";
import { PolicyIdentifierInput } from "../../../types";

export const ItemCheckbox: FunctionComponent<{
  cartItem: CartItem;
  updateCart: CartHook["updateCart"];
  identifierInputs: PolicyIdentifierInput[];
}> = ({ cartItem, updateCart, identifierInputs }) => {
  const { category, quantity, maxQuantity } = cartItem;
  const { getProduct } = useProductContext();
  const { name = category, description, quantity: productQuantity } =
    getProduct(category) || {};

  return (
    <Checkbox
      label={
        <ItemContent
          name={name}
          description={description}
          unit={productQuantity?.unit}
          maxQuantity={maxQuantity}
        />
      }
      isChecked={quantity > 0}
<<<<<<< HEAD
      onToggle={() =>
        updateCart(category, quantity > 0 ? 0 : maxQuantity, identifierInputs)
      }
=======
      onToggle={() => updateCart(category, quantity > 0 ? 0 : maxQuantity)}
>>>>>>> 8529d73... fix: identifiers were not updated to cart correctly for multiple policies with identifiers
    />
  );
};
