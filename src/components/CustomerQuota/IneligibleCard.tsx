import React, { FunctionComponent } from "react";
import { View, Text } from "react-native";
import { CustomerCard } from "./CustomerCard";
import { AppText } from "../Layout/AppText";
import { color, size } from "../../common/styles";
import { sharedStyles } from "./sharedStyles";
import { DarkButton } from "../Layout/Buttons/DarkButton";

const IneligibleTransactionTitle: FunctionComponent = () => (
  <AppText style={sharedStyles.statusTitle}>Limit reached.</AppText>
);

const IneligibleTransactionDescription: FunctionComponent = () => (
  <AppText style={{ marginBottom: size(1) }}>
    Please log an appeal request.
  </AppText>
);

interface IneligibleCard {
  nrics: string[];
  onCancel: () => void;
}

/**
 * Shows when the user cannot is not eligible for redemption/purchase
 */
export const IneligibleCard: FunctionComponent<IneligibleCard> = ({
  nrics,
  onCancel
}) => {
  return (
    <View>
      <CustomerCard nrics={nrics} headerBackgroundColor={color("red", 60)}>
        <View
          style={[
            sharedStyles.resultWrapper,
            sharedStyles.failureResultWrapper
          ]}
        >
          <Text style={sharedStyles.emoji}>❌</Text>
          <AppText style={sharedStyles.statusTitleWrapper}>
            <IneligibleTransactionTitle />
          </AppText>
          <View>
            <IneligibleTransactionDescription />
          </View>
        </View>
      </CustomerCard>
      <View style={sharedStyles.ctaButtonsWrapper}>
        <DarkButton text="Next identity" onPress={onCancel} fullWidth={true} />
      </View>
    </View>
  );
};
