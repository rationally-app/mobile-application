import React, { FunctionComponent } from "react";
import { View, Text } from "react-native";
import { CustomerCard } from "./CustomerCard";
import { AppText } from "../Layout/AppText";
import { color, size } from "../../common/styles";
import { sharedStyles } from "./sharedStyles";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { FontAwesome } from "@expo/vector-icons";

const NotEligibleTransactionTitle: FunctionComponent = () => (
  <AppText style={sharedStyles.statusTitle}>Not eligible</AppText>
);

const NotEligibleTransactionDescription: FunctionComponent = () => (
  <AppText style={{ marginBottom: size(1) }}>
    Please log an appeal request.
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
        <DarkButton text="Next identity" onPress={onCancel} fullWidth={true} />
      </View>
    </View>
  );
};
