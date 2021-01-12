import React, { FunctionComponent, useContext, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { CustomerCard } from "../CustomerCard";
import { AppText } from "../../Layout/AppText";
import { color, size } from "../../../common/styles";
import { sharedStyles } from "../sharedStyles";
import { FontAwesome } from "@expo/vector-icons";
import { useTranslate } from "../../../hooks/useTranslate/useTranslate";
import { DarkButton } from "../../Layout/Buttons/DarkButton";
import { AuthContext } from "../../../context/auth";
import { usePastTransaction } from "../../../hooks/usePastTransaction/usePastTransaction";
import { TransactionsGroup } from "../TransactionsGroup";
import { AlertModalContext } from "../../../context/alert";
import {
  groupTransactionsByTime,
  sortTransactions,
} from "../CheckoutSuccess/CheckoutSuccessCard";
import { CampaignConfigContext } from "../../../context/campaignConfig";
import { BIG_NUMBER } from "../utils";

const styles = StyleSheet.create({
  checkoutItemsList: {
    marginTop: size(2),
  },
});

const CheckoutUnsuccessfulCardTitle: FunctionComponent = () => {
  const { i18nt } = useTranslate();
  return (
    <AppText style={sharedStyles.statusTitle}>
      {i18nt("checkoutUnsuccessfulScreen", "unsuccessful")}
    </AppText>
  );
};

const CheckoutUnsuccessfulCardDescription: FunctionComponent = () => {
  const { i18nt } = useTranslate();
  return (
    <AppText style={{ marginBottom: size(1) }}>
      {`${i18nt("checkoutUnsuccessfulScreen", "logAppeal")}`}
    </AppText>
  );
};

interface CheckoutUnsuccessfulCard {
  ids: string[];
  onCancel: () => void;
}

/**
 * Shows when the user is not able to return tt-token due to:
 * - Redeemed token and returned token does not have the same id
 * - Have not redeemed the token but attempted to return
 */
export const CheckoutUnsuccessfulCard: FunctionComponent<CheckoutUnsuccessfulCard> = ({
  ids,
  onCancel,
}) => {
  const { policies: allProducts } = useContext(CampaignConfigContext);
  const { sessionToken, endpoint } = useContext(AuthContext);
  const { pastTransactionsResult, loading, error } = usePastTransaction(
    ids,
    sessionToken,
    endpoint
  );
  // Assumes results are already sorted (valid assumption for results from /transactions/history)
  const sortedTransactions = pastTransactionsResult;

  const { showErrorAlert } = useContext(AlertModalContext);
  useEffect(() => {
    if (error) {
      showErrorAlert(error);
    }
  }, [error, showErrorAlert]);

  const translationProps = useTranslate();
  const transactionsByTimeMap = groupTransactionsByTime(
    sortedTransactions,
    allProducts || [],
    translationProps
  );
  const transactionsByTimeList = sortTransactions(transactionsByTimeMap);

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
            accessibilityLabel="checkout-unsuccessful-title"
            testID="checkout-unsuccessful-title"
            accessible={true}
          >
            <CheckoutUnsuccessfulCardTitle />
          </AppText>
          <View>
            <CheckoutUnsuccessfulCardDescription />
          </View>
          <View>
            <AppText>
              {`${i18nt(
                "checkoutUnsuccessfulScreen",
                "unsuccessfulRedeemAttempt"
              )}:`}
            </AppText>
            <View style={styles.checkoutItemsList}>
              {loading ? (
                <ActivityIndicator
                  style={{ alignSelf: "flex-start" }}
                  size="large"
                  color={color("grey", 40)}
                />
              ) : (
                transactionsByTimeList.map(
                  (transactionsByTime: TransactionsGroup, index: number) => (
                    <TransactionsGroup
                      key={index}
                      maxTransactionsToDisplay={BIG_NUMBER}
                      {...transactionsByTime}
                    />
                  )
                )
              )}
            </View>
          </View>
        </View>
      </CustomerCard>
      <View style={sharedStyles.ctaButtonsWrapper}>
        <DarkButton
          text={i18nt("checkoutSuccessScreen", "nextIdentity")}
          onPress={onCancel}
          fullWidth={true}
          accessibilityLabel="checkout-unsuccessful-next-identity-button"
        />
      </View>
    </View>
  );
};
