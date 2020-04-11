import React, { FunctionComponent } from "react";
import { useProductContext } from "../../context/products";
import { View, StyleSheet } from "react-native";
import { CustomerCard } from "./CustomerCard";
import { AppText } from "../Layout/AppText";
import { sharedStyles } from "./sharedStyles";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { size, fontSize } from "../../common/styles";
import { CartHook } from "../../hooks/useCart/useCart";

const styles = StyleSheet.create({
  purchasedItemsList: {
    marginTop: size(1),
    lineHeight: 1.5 * fontSize(0),
    marginBottom: -size(2)
  }
});

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
  const { getProduct } = useProductContext();
  let purchasedItems = "";
  checkoutResult?.transactions.forEach((userTransaction, idx) => {
    const userNric = nrics[idx];
    const { transaction } = userTransaction;
    transaction.forEach(({ category, quantity }) => {
      if (quantity > 0) {
        const categoryName = getProduct(category)?.name ?? category;
        purchasedItems += `• ${categoryName}${
          nrics.length > 1 ? ` (${userNric})` : ""
        }\n`;
      }
    });
  });

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
            <AppText style={styles.purchasedItemsList}>
              {purchasedItems}
            </AppText>
          </View>
        </View>
      </CustomerCard>
      <View style={sharedStyles.ctaButtonsWrapper}>
        <DarkButton text="Next customer" onPress={onCancel} fullWidth={true} />
      </View>
    </View>
  );
};
