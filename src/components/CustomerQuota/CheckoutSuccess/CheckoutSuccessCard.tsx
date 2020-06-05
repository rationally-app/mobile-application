import React, { FunctionComponent } from "react";
import { View } from "react-native";
import { CustomerCard } from "../CustomerCard";
import { AppText } from "../../Layout/AppText";
import { sharedStyles } from "../sharedStyles";
import { DarkButton } from "../../Layout/Buttons/DarkButton";
import { CartHook } from "../../../hooks/useCart/useCart";
import { PurchaseSuccessDetail } from "./PurchaseSuccessDetail";
import { getPurchasedQuantitiesByItem } from "../utils";
import { useProductContext } from "../../../context/products";
import { RedeemSuccessDetail } from "./RedeemSuccessDetail";

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
          {checkoutType === "redeem" ? (
            <RedeemSuccessDetail />
          ) : (
            <PurchaseSuccessDetail
              purchasedQuantitiesByItem={checkoutQuantities}
            />
          )}
        </View>
      </CustomerCard>
      <View style={sharedStyles.ctaButtonsWrapper}>
        <DarkButton text={ctaButtonText} onPress={onCancel} fullWidth={true} />
      </View>
    </View>
  );
};
