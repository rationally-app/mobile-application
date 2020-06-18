import React, { FunctionComponent, useState, useEffect } from "react";
import { CartItem, CartHook } from "../../../hooks/useCart/useCart";
import { View } from "react-native";
import { Stepper } from "../../Layout/Stepper";
import { AppText } from "../../Layout/AppText";
import { ItemMaxUnitLabel } from "./ItemMaxUnitLabel";
import { ItemContent } from "./ItemContent";
import { useProductContext } from "../../../context/products";
import { sharedStyles } from "./sharedStyles";

export const ItemStepper: FunctionComponent<{
  cartItem: CartItem;
  updateCart: CartHook["updateCart"];
}> = ({ cartItem, updateCart }) => {
  const { category, quantity, maxQuantity } = cartItem;
  const { getProduct } = useProductContext();
  const { name = category, description, quantity: productQuantity } =
    getProduct(category) || {};

  const [stepperValue, setStepperValue] = useState(quantity);

  useEffect(() => {
    if (stepperValue !== quantity) {
      updateCart(category, stepperValue);
    }
  }, [category, quantity, stepperValue, updateCart]);

  // Sync internal and external quantity
  useEffect(() => {
    setStepperValue(v => (v !== quantity ? quantity : v));
  }, [quantity]);

  return (
    <View
      style={[
        sharedStyles.wrapper,
        quantity > 0
          ? sharedStyles.wrapperHighlighted
          : sharedStyles.wrapperDefault
      ]}
    >
      <View style={sharedStyles.contentWrapper}>
        <ItemContent
          name={name}
          description={description}
          unit={productQuantity?.unit}
          maxQuantity={maxQuantity}
        />
      </View>
      <View>
        <Stepper
          value={stepperValue}
          setValue={setStepperValue}
          bounds={{ min: 0, max: maxQuantity }}
          step={productQuantity?.step}
          unit={
            (productQuantity?.unit?.label.length ?? 0) <= 3
              ? productQuantity?.unit
              : undefined
          }
        />
        <AppText
          style={[sharedStyles.maxQuantityLabel, { textAlign: "center" }]}
        >
          <ItemMaxUnitLabel
            unit={productQuantity?.unit}
            maxQuantity={maxQuantity}
          />
        </AppText>
      </View>
    </View>
  );
};
