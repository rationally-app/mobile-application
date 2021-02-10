import React, { FunctionComponent, useContext, useState } from "react";
import { Checkbox } from "../../Layout/Checkbox";
import { ItemContent } from "./ItemContent";
import { CartItem, CartHook } from "../../../hooks/useCart/useCart";
import { ProductContext } from "../../../context/products";
import { ChargeableItems } from "./ChargeableItems";

export const ItemCheckbox: FunctionComponent<{
  ids: string[];
  cartItem: CartItem;
  updateCart: CartHook["updateCart"];
}> = ({ ids, cartItem, updateCart }) => {
  const [isShowChargeableItems, setIsShowChargeableItems] = useState<boolean>(
    false
  );
  const { category, quantity, maxQuantity } = cartItem;
  const { getProduct } = useContext(ProductContext);
  const { name = category, description, quantity: productQuantity } =
    getProduct(category) || {};

  return (
    <Checkbox
      label={
        <ItemContent
          name={name}
          description={description}
          descriptionAlert={cartItem.descriptionAlert}
          unit={productQuantity?.unit}
          maxQuantity={maxQuantity}
          accessibilityLabel="item-checkbox"
          showChargeableToggle={() =>
            setIsShowChargeableItems(!isShowChargeableItems)
          }
          isShowChargeable={isShowChargeableItems}
        />
      }
      addons={
        <ChargeableItems ids={ids} isShowChargeable={isShowChargeableItems} />
      }
      isChecked={quantity > 0}
      onToggle={() => updateCart(category, quantity > 0 ? 0 : maxQuantity)}
    />
  );
};
