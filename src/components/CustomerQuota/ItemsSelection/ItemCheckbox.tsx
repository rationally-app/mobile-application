import React, { FunctionComponent, useContext, useState } from "react";
import { Checkbox } from "../../Layout/Checkbox";
import { ItemContent } from "./ItemContent";
import { CartItem, CartHook } from "../../../hooks/useCart/useCart";
import { ProductContext } from "../../../context/products";
import { AddonsItems } from "./AddonsItems";
import { TransactionsGroup } from "../TransactionsGroup";
import { ShowAddonsToggle } from "./ShowAddonsToggle";

export const ItemCheckbox: FunctionComponent<{
  ids: string[];
  addonToggleItem: boolean;
  cartItem: CartItem;
  updateCart: CartHook["updateCart"];
}> = ({ ids, addonToggleItem, cartItem, updateCart }) => {
  const [isShowAddonsItems, setIsShowAddonsItems] = useState(false);
  const [addonsTransactionList, setAddonsTransactionList] = useState<
    TransactionsGroup[]
  >([]);
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
          unit={productQuantity?.unit}
          maxQuantity={maxQuantity}
          accessibilityLabel="item-checkbox"
        />
      }
      addonsLabel={
        descriptionAlert && descriptionAlert.length > 0 ? (
          <ShowAddonsToggle
            descriptionAlert={descriptionAlert}
            toggleIsShowAddons={(e) => {
              e.stopPropagation();
              setIsShowAddonsItems(!isShowAddonsItems);
            }}
            isShowAddons={isShowAddonsItems}
            addonsTransactionList={addonsTransactionList}
            setAddonsTransactionList={setAddonsTransactionList}
            ids={ids}
            categoryFilter={category}
          />
        ) : undefined
      }
      addons={
        addonToggleItem ? (
          <AddonsItems
            transactionList={addonsTransactionList}
            isShowAddonItems={isShowAddonsItems}
          />
        ) : undefined
      }
      isChecked={quantity > 0}
      onToggle={() => updateCart(category, quantity > 0 ? 0 : maxQuantity)}
    />
  );
};
