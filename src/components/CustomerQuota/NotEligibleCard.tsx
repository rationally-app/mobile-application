import React, { FunctionComponent } from "react";
import { View } from "react-native";
import { CustomerCard } from "./CustomerCard";
import { AppText } from "../Layout/AppText";
import { color, size } from "../../common/styles";
import { sharedStyles } from "./sharedStyles";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { FontAwesome } from "@expo/vector-icons";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";

const NotEligibleTransactionTitle: FunctionComponent = () => {
  const { i18nt } = useTranslate();
  return (
    <AppText style={sharedStyles.statusTitle}>
      {i18nt("notEligibleScreen", "notEligible")}
    </AppText>
  );
};

const NotEligibleTransactionDescription: FunctionComponent = () => {
  const { i18nt, c13nt } = useTranslate();
  return (
    <AppText style={{ marginBottom: size(1) }}>
      {`${c13nt("notEligibleDescription")}` ??
        `${i18nt("notEligibleScreen", "logAppeal")}`}
    </AppText>
  );
};

interface NotEligibleCard {
  ids: string[];
  onCancel: () => void;
}

/**
 * Shows when the user cannot is not eligible for redemption/purchase
 */
export const NotEligibleCard: FunctionComponent<NotEligibleCard> = ({
  ids,
  onCancel,
}) => {
  const { i18nt } = useTranslate();
  return (
    <View>
      <CustomerCard ids={ids} headerBackgroundColor={color("red", 60)}>
        <View
          style={[
            sharedStyles.resultWrapper,
            sharedStyles.failureResultWrapper,
          ]}
        >
          <FontAwesome
            name="thumbs-down"
            color={color("red", 60)}
            style={sharedStyles.icon}
          />
          <AppText
            style={sharedStyles.statusTitleWrapper}
            accessibilityLabel="not-eligible-title"
            testID="not-eligible-title"
            accessible={true}
          >
            <NotEligibleTransactionTitle />
          </AppText>
          <View>
            <NotEligibleTransactionDescription />
          </View>
        </View>
      </CustomerCard>
      <View style={sharedStyles.ctaButtonsWrapper}>
        <DarkButton
          text={i18nt("checkoutSuccessScreen", "nextIdentity")}
          onPress={onCancel}
          fullWidth={true}
          accessibilityLabel="not-eligible-next-identity-button"
        />
      </View>
    </View>
  );
};
