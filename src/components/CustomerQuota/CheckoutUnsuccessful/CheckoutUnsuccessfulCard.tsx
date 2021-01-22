import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { CustomerCard } from "../CustomerCard";
import { AppText } from "../../Layout/AppText";
import { color, size } from "../../../common/styles";
import { sharedStyles } from "../sharedStyles";
import { FontAwesome } from "@expo/vector-icons";
import { useTranslate } from "../../../hooks/useTranslate/useTranslate";
import { Cart } from "../../../hooks/useCart/useCart";
import { DarkButton } from "../../Layout/Buttons/DarkButton";
import { AuthContext } from "../../../context/auth";
import { ShowFullListToggle } from "../ShowFullListToggle";
import { usePastTransaction } from "../../../hooks/usePastTransaction/usePastTransaction";
import { Quota } from "../../../types";
import { TransactionsGroup } from "../TransactionsGroup";
import { AlertModalContext } from "../../../context/alert";
import {
  groupTransactionsByCategory,
  sortTransactions,
  getLatestTransactionTime,
} from "../NoQuota/NoQuotaCard";
import { CampaignConfigContext } from "../../../context/campaignConfig";
import { BIG_NUMBER } from "../utils";

const MAX_TRANSACTIONS_TO_DISPLAY = 1;

const styles = StyleSheet.create({
  checkoutItemsList: {
    marginTop: size(2),
  },
});

interface CheckoutUnsuccessfulCard {
  ids: string[];
  cart: Cart;
  onCancel: () => void;
  quotaResponse: Quota | undefined;
}

/**
 * Shows when the user is not able to return tt-token due to:
 * - Redeemed token and returned token does not have the same id
 * - Have not redeemed the token but attempted to return
 */
export const CheckoutUnsuccessfulCard: FunctionComponent<CheckoutUnsuccessfulCard> = ({
  ids,
  cart,
  onCancel,
  quotaResponse,
}) => {
  const [isShowFullList, setIsShowFullList] = useState<boolean>(false);
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

  const latestTransactionTime: Date | undefined =
    (quotaResponse && getLatestTransactionTime(cart)) ?? undefined;

  const translationProps = useTranslate();
  const transactionsByCategoryMap = groupTransactionsByCategory(
    sortedTransactions,
    allProducts || [],
    latestTransactionTime,
    translationProps
  );

  const transactionsByCategoryList = sortTransactions(
    transactionsByCategoryMap
  );
  const { i18nt } = useTranslate();
  return (
    <View>
      <CustomerCard ids={ids} headerBackgroundColor={color("red", 60)}>
        <View style={sharedStyles.failureResultWrapper}>
          <View style={sharedStyles.resultWrapper}>
            <FontAwesome
              name="thumbs-down"
              color={color("red", 60)}
              style={sharedStyles.icon}
            />
            <View style={sharedStyles.statusTitleWrapper}>
              <AppText
                style={sharedStyles.statusTitle}
                accessibilityLabel="checkout-unsuccessful-title"
                testID="checkout-unsuccessful-title"
                accessible={true}
              >
                {i18nt("checkoutUnsuccessfulScreen", "unsuccessful")}
              </AppText>
            </View>
            <View>
              <AppText style={{ marginBottom: size(1) }}>
                {i18nt("checkoutUnsuccessfulScreen", "logAppeal")}
              </AppText>
            </View>
            <View>
              <View style={styles.checkoutItemsList}>
                {loading ? (
                  <ActivityIndicator
                    style={{ alignSelf: "flex-start" }}
                    size="large"
                    color={color("grey", 40)}
                  />
                ) : (
                  <View>
                    <AppText>
                      {`${i18nt(
                        "checkoutUnsuccessfulScreen",
                        "unsuccessfulRedeemAttempt"
                      )}:`}
                    </AppText>
                    {transactionsByCategoryList.map(
                      (
                        transactionsByCategory: TransactionsGroup,
                        index: number
                      ) => (
                        <TransactionsGroup
                          key={index}
                          maxTransactionsToDisplay={
                            isShowFullList
                              ? BIG_NUMBER
                              : MAX_TRANSACTIONS_TO_DISPLAY
                          }
                          {...transactionsByCategory}
                        />
                      )
                    )}
                  </View>
                )}
              </View>
            </View>
          </View>
          {!loading &&
            sortedTransactions &&
            sortedTransactions.length > MAX_TRANSACTIONS_TO_DISPLAY && (
              <ShowFullListToggle
                toggleIsShowFullList={() => setIsShowFullList(!isShowFullList)}
                isShowFullList={isShowFullList}
              />
            )}
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
