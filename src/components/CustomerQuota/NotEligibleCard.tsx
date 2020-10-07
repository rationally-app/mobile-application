import React, { FunctionComponent } from "react";
import { View } from "react-native";
import { CustomerCard } from "./CustomerCard";
import { AppText } from "../Layout/AppText";
import { color, size } from "../../common/styles";
import { sharedStyles } from "./sharedStyles";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { FontAwesome } from "@expo/vector-icons";
import { getTranslatedStringWithI18n } from "../../utils/translations";

const NotEligibleTransactionTitle: FunctionComponent = () => (
  <AppText style={sharedStyles.statusTitle}>
    {getTranslatedStringWithI18n("notEligibleScreen", "notEligible")}
  </AppText>
);

const NotEligibleTransactionDescription: FunctionComponent = () => (
  <AppText style={{ marginBottom: size(1) }}>
    {`${getTranslatedStringWithI18n("notEligibleScreen", "logAppeal")}.`}
  </AppText>
);

interface NotEligibleCard {
  ids: string[];
  onCancel: () => void;
}

/**
 * Shows when the user cannot is not eligible for redemption/purchase
 */
export const NotEligibleCard: FunctionComponent<NotEligibleCard> = ({
  ids,
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
          text={getTranslatedStringWithI18n(
            "checkoutSuccessScreen",
            "redeemedNextIdentity"
          )}
          onPress={onCancel}
          fullWidth={true}
        />
      </View>
    </View>
  );
};
