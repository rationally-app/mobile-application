import { FunctionComponent } from "react";
import { size, fontSize, color } from "../../../common/styles";
import { Policy } from "../../../types";
import { formatQuantityText } from "../utils";
import { View, StyleSheet } from "react-native";
import { AppText } from "../../Layout/AppText";
import { ItemQuantities, PurchasedQuantitiesByItem } from "../types";
import { useProductContext } from "../../../context/products";
import { sum } from "lodash";
import React from "react";

const styles = StyleSheet.create({
  purchasedItemsList: {
    marginTop: size(2)
  },
  purchasedItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline"
  },
  purchasedItemHeaderText: {
    fontFamily: "brand-bold"
  },
  purchasedQuantityByIdText: {
    fontSize: fontSize(-1)
  },
  purchasedQuantitiesWrapper: {
    flexDirection: "row",
    marginTop: size(0.5)
  },
  purchasedQuantitiesBorder: {
    borderLeftWidth: 1,
    borderLeftColor: color("grey", 30),
    marginLeft: size(1),
    marginRight: size(1)
  }
});

const PurchasedQuantityById: FunctionComponent<{
  id: string;
  quantity: number;
  unit?: Policy["quantity"]["unit"];
}> = ({ id, quantity, unit }) => {
  const quantityText = formatQuantityText(quantity, unit);
  return (
    <View style={styles.purchasedItemRow}>
      <AppText style={styles.purchasedQuantityByIdText}>{id}</AppText>
      <AppText style={styles.purchasedQuantityByIdText}>{quantityText}</AppText>
    </View>
  );
};

const PurchasedItem: FunctionComponent<{
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
      <View style={styles.purchasedItemRow}>
        <AppText style={styles.purchasedItemHeaderText}>{categoryName}</AppText>
        <AppText style={styles.purchasedItemHeaderText}>
          {totalQuantityText}
        </AppText>
      </View>
      <View style={styles.purchasedQuantitiesWrapper}>
        <View style={styles.purchasedQuantitiesBorder} />
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

export const PurchaseSuccessDetail: FunctionComponent<{
  purchasedQuantitiesByItem: PurchasedQuantitiesByItem;
}> = ({ purchasedQuantitiesByItem }) => {
  return (
    <View>
      <AppText>The following have been purchased:</AppText>
      <View style={styles.purchasedItemsList}>
        {purchasedQuantitiesByItem.map(item => (
          <PurchasedItem key={item.category} itemQuantities={item} />
        ))}
      </View>
    </View>
  );
};
