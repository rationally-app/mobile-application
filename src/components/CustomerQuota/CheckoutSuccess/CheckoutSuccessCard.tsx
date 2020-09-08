import React, { FunctionComponent, useContext } from "react";
import { View, StyleSheet } from "react-native";
import { CustomerCard } from "../CustomerCard";
import { AppText } from "../../Layout/AppText";
import { sharedStyles } from "../sharedStyles";
import { DarkButton } from "../../Layout/Buttons/DarkButton";
import { CartHook } from "../../../hooks/useCart/useCart";
import { PurchasedItem } from "./PurchasedItem";
import { getPurchasedQuantitiesByItem } from "../utils";
import { RedeemedItem } from "./RedeemedItem";
import { size, color } from "../../../common/styles";
import { getCheckoutMessages } from "./checkoutMessages";
import { FontAwesome } from "@expo/vector-icons";
import { format } from "date-fns";
import { Quota } from "../../../types";
import { ProductContext } from "../../../context/products";

const styles = StyleSheet.create({
  checkoutItemsList: {
    marginTop: size(2)
  }
});

interface CheckoutSuccessCard {
  ids: string[];
  onCancel: () => void;
  checkoutResult: CartHook["checkoutResult"];
  quotaResponse: Quota | null;
}

const UsageQuotaTitle: FunctionComponent<{
  quantity: number;
  quotaRefreshTime: number;
}> = ({ quantity, quotaRefreshTime }) => (
  <>
    <AppText style={sharedStyles.statusTitle}>
      {"\n"}
      {quantity} item(s) more till {format(quotaRefreshTime, "d MMM yyyy")}.
    </AppText>
  </>
);

export const CheckoutSuccessCard: FunctionComponent<CheckoutSuccessCard> = ({
  ids,
  onCancel,
  checkoutResult,
  quotaResponse
}) => {
  const checkoutQuantities = getPurchasedQuantitiesByItem(ids, checkoutResult!);
  const { getProduct } = useContext(ProductContext);
  const productType = getProduct(checkoutQuantities[0].category)?.type;
  const { title, description, ctaButtonText } = getCheckoutMessages(
    productType
  );

  const showGlobalQuota: boolean =
    !!quotaResponse?.globalQuota &&
    !!getProduct(checkoutQuantities[0].category)?.quantity.usage;

  return (
    <View>
      <CustomerCard ids={ids}>
        <View
          style={[
            sharedStyles.resultWrapper,
            sharedStyles.successfulResultWrapper
          ]}
        >
          <FontAwesome
            name="thumbs-up"
            color={color("blue-green", 40)}
            style={sharedStyles.icon}
          />
          <AppText style={sharedStyles.statusTitleWrapper}>
            <AppText style={sharedStyles.statusTitle}>{title}</AppText>
            {showGlobalQuota &&
              quotaResponse!.globalQuota!.map(
                ({ quantity, quotaRefreshTime }, index: number) =>
                  quotaRefreshTime ? (
                    <UsageQuotaTitle
                      key={index}
                      quantity={quantity}
                      quotaRefreshTime={quotaRefreshTime}
                    />
                  ) : undefined
              )}
          </AppText>
          <View>
            <AppText>{description}</AppText>
            <View style={styles.checkoutItemsList}>
              {checkoutQuantities.map(item => {
                return productType === "REDEEM" ? (
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
