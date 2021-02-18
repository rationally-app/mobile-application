import React, { FunctionComponent, useContext, useState } from "react";
import { Checkbox } from "../../Layout/Checkbox";
import { ItemContent } from "./ItemContent";
import { CartItem, CartHook } from "../../../hooks/useCart/useCart";
import { ProductContext } from "../../../context/products";
import { AddonsItems } from "./AddonsItems";

export const ItemCheckbox: FunctionComponent<{
  cartItem: CartItem;
  updateCart: CartHook["updateCart"];
}> = ({ cartItem, updateCart }) => {
  const [isShowAddonsItems, setIsShowAddonsItems] = useState(false);
  const { category, quantity, maxQuantity, descriptionAlert } = cartItem;
  const { getProduct } = useContext(ProductContext);
  const { name = category, description, quantity: productQuantity } =
    getProduct(category) || {};

  return (
    <Checkbox
      label={
        <ItemContent
          name={name}
          description={description}
          descriptionAlert={descriptionAlert}
          unit={productQuantity?.unit}
          maxQuantity={maxQuantity}
          accessibilityLabel="item-checkbox"
          showAddonsToggle={(e) => {
            e.stopPropagation();
            setIsShowAddonsItems(!isShowAddonsItems);
          }}
          showAddons={isShowAddonsItems}
        />
      }
      addons={<AddonsItems isShowAddons={isShowAddonsItems} />}
      isChecked={quantity > 0}
      onToggle={() => updateCart(category, quantity > 0 ? 0 : maxQuantity)}
    />
  );
};
