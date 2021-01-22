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
import { DarkButton } from "../../Layout/Buttons/DarkButton";
import { AuthContext } from "../../../context/auth";
import { ShowFullListToggle } from "../ShowFullListToggle";
import { usePastTransaction } from "../../../hooks/usePastTransaction/usePastTransaction";
import { TransactionsGroup } from "../TransactionsGroup";
import { AlertModalContext } from "../../../context/alert";
import {
  groupTransactionsByTime,
  sortTransactions,
} from "../CheckoutSuccess/CheckoutSuccessCard";
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
          <AppText style={sharedStyles.statusTitleWrapper}>
            <AppText
              style={sharedStyles.statusTitle}
              accessibilityLabel="checkout-unsuccessful-title"
              testID="checkout-unsuccessful-title"
              accessible={true}
            >
              {i18nt("checkoutUnsuccessfulScreen", "unsuccessful")}
            </AppText>
          </AppText>
          <View>
            <AppText style={{ marginBottom: size(1) }}>
              {i18nt("checkoutUnsuccessfulScreen", "logAppeal")}
            </AppText>
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
                (isShowFullList
                  ? transactionsByTimeList
                  : transactionsByTimeList.slice(0, MAX_TRANSACTIONS_TO_DISPLAY)
                ).map(
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
          {!loading &&
            transactionsByTimeList.length > MAX_TRANSACTIONS_TO_DISPLAY && (
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
