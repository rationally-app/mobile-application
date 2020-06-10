import { FunctionComponent } from "react";
import { size } from "../../../common/styles";
import { Policy } from "../../../types";
import { formatQuantityText } from "../utils";
import { View } from "react-native";
import { AppText } from "../../Layout/AppText";
import { ItemQuantities } from "../types";
import { useProductContext } from "../../../context/products";
import { sum } from "lodash";
import React from "react";
import { sharedStyles } from "./sharedStyles";

const PurchasedQuantityById: FunctionComponent<{
  id: string;
  quantity: number;
  unit?: Policy["quantity"]["unit"];
}> = ({ id, quantity, unit }) => {
  const quantityText = formatQuantityText(quantity, unit);
  return (
    <View style={sharedStyles.itemRow}>
      <AppText style={sharedStyles.quantityByIdText}>{id}</AppText>
      <AppText style={sharedStyles.quantityByIdText}>{quantityText}</AppText>
    </View>
  );
};

export const PurchasedItem: FunctionComponent<{
  itemQuantities: ItemQuantities;
}> = ({ itemQuantities }) => {
  const { getProduct } = useProductContext();
  const { category, quantities } = itemQuantities;
  const categoryName = getProduct(category)?.name ?? category;
  const unit = getProduct(category)?.quantity.unit;
  const totalQuantity = sum(Object.values(quantities));
  const totalQuantityText = formatQuantityText(totalQuantity, unit);
  return (
    <View style={{ marginBottom: size(1.5) }}>
      <View style={sharedStyles.itemRow}>
        <AppText style={sharedStyles.itemHeaderText}>{categoryName}</AppText>
        <AppText style={sharedStyles.itemHeaderText}>
          {totalQuantityText}
        </AppText>
      </View>
      <View style={sharedStyles.quantitiesWrapper}>
        <View style={sharedStyles.quantitiesBorder} />
        <View style={{ flexGrow: 1 }}>
          {Object.entries(quantities)
            .filter(([_, quantity]) => quantity > 0)
            .map(([id, quantity]) => (
              <PurchasedQuantityById
                key={id}
                id={id}
                quantity={quantity}
                unit={unit}
              />
            ))}
        </View>
      </View>
    </View>
  );
};
