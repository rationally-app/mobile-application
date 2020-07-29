import { FunctionComponent } from "react";
import { View } from "react-native";
import { AppText } from "../../Layout/AppText";
import React from "react";
import { ItemQuantities } from "../types";
import { size } from "../../../common/styles";
import { useProductContext } from "../../../context/products";
import { sharedStyles } from "./sharedStyles";
import { getIdentifierInputDisplay } from "../../../utils/getIdentifierInputDisplay";

export const RedeemedItem: FunctionComponent<{
  itemQuantities: ItemQuantities;
}> = ({ itemQuantities }) => {
  const { getProduct } = useProductContext();
  const { category, identifierInputs, quantities } = itemQuantities;
  const categoryName = getProduct(category)?.name ?? category;

  const identifierInputDisplay = identifierInputs
    ? getIdentifierInputDisplay(identifierInputs)
    : null;

  const quantitiesDisplay = Object.values(quantities)[0];

  return (
    <View style={{ marginBottom: size(1.5) }}>
      <View style={sharedStyles.itemRow}>
        <AppText style={sharedStyles.itemHeaderText}>{categoryName}</AppText>
      </View>
      <View style={sharedStyles.quantitiesWrapper}>
        <View style={sharedStyles.quantitiesBorder} />
        <AppText style={sharedStyles.quantityByIdText}>
          {identifierInputDisplay ?? quantitiesDisplay}
        </AppText>
      </View>
    </View>
  );
};
