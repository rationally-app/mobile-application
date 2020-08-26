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
import { size, color } from "../../../common/styles";
import { getCheckoutMessages } from "./checkoutMessages";
import { FontAwesome } from "@expo/vector-icons";

const styles = StyleSheet.create({
  checkoutItemsList: {
    marginTop: size(2)
  }
});

interface CheckoutSuccessCard {
  ids: string[];
  onCancel: () => void;
  checkoutResult: CartHook["checkoutResult"];
}

export const CheckoutSuccessCard: FunctionComponent<CheckoutSuccessCard> = ({
  ids,
  onCancel,
  checkoutResult
}) => {
  const checkoutQuantities = getPurchasedQuantitiesByItem(ids, checkoutResult!);
  const { getProduct } = useProductContext();
  const productType = getProduct(checkoutQuantities[0].category)?.type;
  const { title, description, ctaButtonText } = getCheckoutMessages(
    productType
  );

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
