import React, { FunctionComponent } from "react";
import { useProductContext } from "../../context/products";
import { View, StyleSheet } from "react-native";
import { CustomerCard } from "./CustomerCard";
import { AppText } from "../Layout/AppText";
import { sharedStyles } from "./sharedStyles";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { size, fontSize, color } from "../../common/styles";
import { CartHook } from "../../hooks/useCart/useCart";
import { Policy } from "../../types";
import { getCheckoutResultByCategory, formatQuantityText } from "./utils";
import { CategoryQuantities } from "./types";
import { sum } from "lodash";

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
  purchasedItemByIdText: {
    fontSize: fontSize(-1)
  },
  breakdownByIdWrapper: {
    flexDirection: "row",
    marginTop: size(0.5)
  },
  breakdownByIdBorder: {
    borderLeftWidth: 1,
    borderLeftColor: color("grey", 30),
    marginLeft: size(1),
    marginRight: size(1)
  }
});

const PurchasedItemById: FunctionComponent<{
  id: string;
  quantity: number;
  unit?: Policy["quantity"]["unit"];
}> = ({ id, quantity, unit }) => {
  const quantityText = formatQuantityText(quantity, unit);
  return (
    <View style={styles.purchasedItemRow}>
      <AppText style={styles.purchasedItemByIdText}>{id}</AppText>
      <AppText style={styles.purchasedItemByIdText}>{quantityText}</AppText>
    </View>
  );
};

const PurchasedItem: FunctionComponent<{
  categoryQuantities: CategoryQuantities;
}> = ({ categoryQuantities }) => {
  const { getProduct } = useProductContext();
  const { category, quantities } = categoryQuantities;
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
      <View style={styles.breakdownByIdWrapper}>
        <View style={styles.breakdownByIdBorder} />
        <View style={{ flexGrow: 1 }}>
          {Object.entries(quantities)
            .filter(([_, quantity]) => quantity > 0)
            .map(([id, quantity]) => (
              <PurchasedItemById
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

interface PurchaseSuccessCard {
  nrics: string[];
  onCancel: () => void;
  checkoutResult: CartHook["checkoutResult"];
}

export const PurchaseSuccessCard: FunctionComponent<PurchaseSuccessCard> = ({
  nrics,
  onCancel,
  checkoutResult
}) => {
  const checkoutResultByCategory = getCheckoutResultByCategory(
    nrics,
    checkoutResult!
  );
  return (
    <View>
      <CustomerCard nrics={nrics}>
        <View
          style={[
            sharedStyles.resultWrapper,
            sharedStyles.successfulResultWrapper
          ]}
        >
          <AppText style={sharedStyles.emoji}>✅</AppText>
          <AppText style={sharedStyles.statusTitleWrapper}>
            <AppText style={sharedStyles.statusTitle}>Purchased!</AppText>
          </AppText>
          <View>
            <AppText>The following have been purchased:</AppText>
            <View style={styles.purchasedItemsList}>
              {checkoutResultByCategory.map(result => (
                <PurchasedItem
                  key={result.category}
                  categoryQuantities={result}
                />
              ))}
            </View>
          </View>
        </View>
      </CustomerCard>
      <View style={sharedStyles.ctaButtonsWrapper}>
        <DarkButton text="Next customer" onPress={onCancel} fullWidth={true} />
      </View>
    </View>
  );
};
