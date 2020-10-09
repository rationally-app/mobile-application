import React, { FunctionComponent, useContext } from "react";
import { View } from "react-native";
import { CustomerCard } from "./CustomerCard";
import { AppText } from "../Layout/AppText";
import { color, size } from "../../common/styles";
import { sharedStyles } from "./sharedStyles";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { FontAwesome } from "@expo/vector-icons";
import { Cart } from "../../hooks/useCart/useCart";
import i18n from "i18n-js";

const NotEligibleTransactionTitle: FunctionComponent = () => (
  <AppText style={sharedStyles.statusTitle}>Not eligible</AppText>
);

const NotEligibleTransactionDescription: FunctionComponent = () => (
  <AppText style={{ marginBottom: size(1) }}>
    {`${i18n.t("notEligibleScreen.logAppeal")}.`}
  </AppText>
);

interface NotEligibleCard {
  ids: string[];
  cart: Cart;
  onCancel: () => void;
}

/**
 * Shows when the user cannot is not eligible for redemption/purchase
 */
export const NotEligibleCard: FunctionComponent<NotEligibleCard> = ({
  ids,
  cart,
  onCancel
}) => {
  return (
    <View>
      <CustomerCard ids={ids} headerBackgroundColor={color("red", 60)}>
        <View
          style={[
            sharedStyles.resultWrapper,
            sharedStyles.failureResultWrapper
          ]}
        >
          <FontAwesome
            name="thumbs-down"
            color={color("red", 60)}
            style={sharedStyles.icon}
          />
          <AppText style={sharedStyles.statusTitleWrapper}>
            <NotEligibleTransactionTitle />
          </AppText>
          <View>
            <NotEligibleTransactionDescription />
          </View>
        </View>
      </CustomerCard>
      <View style={sharedStyles.ctaButtonsWrapper}>
        <DarkButton
          text={i18n.t("checkoutSuccessScreen.redeemedNextIdentity")}
          onPress={onCancel}
          fullWidth={true}
        />
      </View>
    </View>
  );
};
