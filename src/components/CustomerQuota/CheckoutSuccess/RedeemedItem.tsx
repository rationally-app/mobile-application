import { FunctionComponent } from "react";
import { View } from "react-native";
import { AppText } from "../../Layout/AppText";
import React from "react";
import { ItemQuantities } from "../types";
import { size } from "../../../common/styles";
import { useProductContext } from "../../../context/products";
import { sharedStyles } from "./sharedStyles";

export const RedeemedItem: FunctionComponent<{
  itemQuantities: ItemQuantities;
}> = ({ itemQuantities }) => {
  const { getProduct } = useProductContext();
  const { category, identifiers } = itemQuantities;
  const categoryName = getProduct(category)?.name ?? category;
  return (
    <View style={{ marginBottom: size(1.5) }}>
      <View style={sharedStyles.itemRow}>
        <AppText style={sharedStyles.itemHeaderText}>{categoryName}</AppText>
      </View>
      <View style={sharedStyles.quantitiesWrapper}>
        <View style={sharedStyles.quantitiesBorder} />
        <AppText style={sharedStyles.quantityByIdText}>
          {`${identifiers[0].value} — ${
            identifiers[identifiers.length - 1].value
          }`}
        </AppText>
      </View>
    </View>
  );
};
