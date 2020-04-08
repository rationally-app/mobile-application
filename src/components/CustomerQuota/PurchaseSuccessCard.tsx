import React, { FunctionComponent } from "react";
import { useProductContext } from "../../context/products";
import { View, StyleSheet } from "react-native";
import { CustomerCard } from "./CustomerCard";
import { AppText } from "../Layout/AppText";
import { sharedStyles } from "./sharedStyles";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { size, fontSize } from "../../common/styles";

const styles = StyleSheet.create({
  purchasedItemsList: {
    marginTop: size(1),
    lineHeight: 1.5 * fontSize(0),
    marginBottom: -size(2)
  },
  purchasedItemText: {
    marginBottom: size(0.5)
  }
});

interface PurchaseSuccessCard {
  nric: string;
  onCancel: () => void;
  purchasedItems: string[];
}

export const PurchaseSuccessCard: FunctionComponent<PurchaseSuccessCard> = ({
  nric,
  onCancel,
  purchasedItems
}) => {
  const { getProduct } = useProductContext();
  return (
    <View>
      <CustomerCard nric={nric}>
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
            <AppText>Customer purchased the following:</AppText>
            <AppText style={styles.purchasedItemsList}>
              {purchasedItems.map(category => {
                const categoryName = getProduct(category)?.name || category;
                return `• ${categoryName}\n`;
              })}
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
