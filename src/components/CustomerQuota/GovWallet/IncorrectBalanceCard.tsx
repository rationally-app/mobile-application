import React, { FunctionComponent } from "react";
import { View } from "react-native";
import { CustomerCard } from "./../CustomerCard";
import { AppText } from "../../Layout/AppText";
import { sharedStyles } from "./../sharedStyles";
import { DarkButton } from "../../Layout/Buttons/DarkButton";
import { FontAwesome } from "@expo/vector-icons";
import { useTranslate } from "../../../hooks/useTranslate/useTranslate";
import { useTheme } from "../../../context/theme";
import { formatCentsAsDollarsAndCents } from "../../../utils/currencyFormatter";
import { size } from "../../../common/styles";

const GovWalletIncorrectBalanceTitle: FunctionComponent = () => {
  const { i18nt, c13nt } = useTranslate();
  return (
    <AppText style={sharedStyles.statusTitle}>
      {c13nt(
        "govWalletIncorrectBalanceTitle",
        undefined,
        i18nt(
          "govWalletIncorrectBalanceScreen",
          "govWalletIncorrectBalanceTitle"
        )
      )}
    </AppText>
  );
};

const GovWalletIncorrectBalanceDescription: FunctionComponent<{
  govWalletBalanceInCents: number;
  lastModifiedDate: string;
}> = ({ govWalletBalanceInCents, lastModifiedDate }) => {
  const { i18nt, c13nt } = useTranslate();

  return (
    <AppText style={{ marginBottom: size(1) }}>
      {c13nt(
        "govWalletIncorrectBalanceDescription",
        undefined,
        i18nt(
          "govWalletIncorrectBalanceScreen",
          "govWalletIncorrectBalanceDescription",
          undefined,
          {
            balance: formatCentsAsDollarsAndCents(govWalletBalanceInCents),
            lastModifiedDate,
          }
        )
      )}
    </AppText>
  );
};

interface GovWalletIncorrectBalanceCard {
  ids: string[];
  onCancel: () => void;
  govWalletBalanceInCents: number;
  lastModifiedDate: string;
}

/**
 * This card is shown when the user balance is not accurate in GovWallet
 */
export const GovWalletIncorrectBalanceCard: FunctionComponent<GovWalletIncorrectBalanceCard> = ({
  ids,
  onCancel,
  govWalletBalanceInCents,
  lastModifiedDate,
}) => {
  const { theme } = useTheme();
  const { i18nt } = useTranslate();

  return (
    <View>
      <CustomerCard
        ids={ids}
        headerBackgroundColor={theme.customerCard.unsuccessfulHeaderColor}
      >
        <View
          style={[
            sharedStyles.resultWrapper,
            sharedStyles.failureResultWrapper,
            { backgroundColor: theme.checkoutUnsuccessfulCard.backgroundColor },
          ]}
        >
          <FontAwesome
            name="thumbs-down"
            color={theme.checkoutUnsuccessfulCard.thumbsDownIconColor}
            style={sharedStyles.icon}
          />
          <AppText
            style={sharedStyles.statusTitleWrapper}
            accessibilityLabel="govwallet-incorrect-balance-title"
            testID="govwallet-incorrect-balance-title"
            accessible={true}
          >
            <GovWalletIncorrectBalanceTitle />
          </AppText>
          <View>
            <GovWalletIncorrectBalanceDescription
              govWalletBalanceInCents={govWalletBalanceInCents}
              lastModifiedDate={lastModifiedDate}
            />
          </View>
        </View>
      </CustomerCard>
      <View style={sharedStyles.ctaButtonsWrapper}>
        <DarkButton
          text={i18nt("checkoutSuccessScreen", "nextIdentity")}
          onPress={onCancel}
          fullWidth={true}
          accessibilityLabel="govwallet-incorrect-balance-next-identity-button"
        />
      </View>
    </View>
  );
};
