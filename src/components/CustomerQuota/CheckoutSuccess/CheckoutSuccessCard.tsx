import React, { FunctionComponent } from "react";
import { View, StyleSheet } from "react-native";
import { CustomerCard } from "../CustomerCard";
import { AppText } from "../../Layout/AppText";
import { sharedStyles } from "../sharedStyles";
import { DarkButton } from "../../Layout/Buttons/DarkButton";
import { CartHook } from "../../../hooks/useCart/useCart";
import { PurchasedItem } from "./PurchasedItem";
import { getPurchasedQuantitiesByItem } from "../utils";
import { useProductContext } from "../../../context/products";
import { RedeemedItem } from "./RedeemedItem";
import { size } from "../../../common/styles";

const styles = StyleSheet.create({
  checkoutItemsList: {
    marginTop: size(2)
  }
});

interface CheckoutSuccessCard {
  nrics: string[];
  onCancel: () => void;
  checkoutResult: CartHook["checkoutResult"];
}

export const CheckoutSuccessCard: FunctionComponent<CheckoutSuccessCard> = ({
  nrics,
  onCancel,
  checkoutResult
}) => {
  const checkoutQuantities = getPurchasedQuantitiesByItem(
    nrics,
    checkoutResult!
  );
  const { getProduct } = useProductContext();
  const checkoutType = getProduct(checkoutQuantities[0].category)?.type;

  const statusTitle = checkoutType === "redeem" ? "Redeemed!" : "Purchased!";
  const pageTitle =
    checkoutType === "redeem"
      ? "Citizen has redeemed the following:"
      : "The following have been purchased:";
  const ctaButtonText =
    checkoutType === "redeem" ? "Next citizen" : "Next customer";

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
            <AppText style={sharedStyles.statusTitle}>{statusTitle}</AppText>
          </AppText>
          <View>
            <AppText>{pageTitle}</AppText>
            <View style={styles.checkoutItemsList}>
              {checkoutQuantities.map(item => {
                return checkoutType === "redeem" ? (
                  <RedeemedItem key={item.category} itemQuantities={item} />
                ) : (
                  <PurchasedItem key={item.category} itemQuantities={item} />
                );
              })}
            </View>
          </View>
        </View>
      </CustomerCard>
      <View style={sharedStyles.ctaButtonsWrapper}>
        <DarkButton text={ctaButtonText} onPress={onCancel} fullWidth={true} />
      </View>
    </View>
  );
};
