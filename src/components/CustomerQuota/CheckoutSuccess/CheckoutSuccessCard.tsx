import React, {
  FunctionComponent,
  useContext,
  useState,
  useEffect,
} from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { CustomerCard } from "../CustomerCard";
import { AppText } from "../../Layout/AppText";
import { sharedStyles } from "../sharedStyles";
import { DarkButton } from "../../Layout/Buttons/DarkButton";
import { size, color } from "../../../common/styles";
import { getCheckoutMessages } from "./checkoutMessages";
import { FontAwesome } from "@expo/vector-icons";
import { Quota, PastTransactionsResult, CampaignPolicy } from "../../../types";
import { ProductContext } from "../../../context/products";
import { AuthContext } from "../../../context/auth";
import { usePastTransaction } from "../../../hooks/usePastTransaction/usePastTransaction";
import {
  formatQuantityText,
  BIG_NUMBER,
  sortTransactionsByOrder,
} from "../utils";
import { TransactionsGroup, Transaction } from "../TransactionsGroup";
import { CampaignConfigContext } from "../../../context/campaignConfig";
import { ShowFullListToggle } from "../ShowFullListToggle";
import { getIdentifierInputDisplay } from "../../../utils/getIdentifierInputDisplay";
import { formatDate, formatDateTime } from "../../../utils/dateTimeFormatter";
import { AlertModalContext } from "../../../context/alert";
import {
  TranslationHook,
  useTranslate,
} from "../../../hooks/useTranslate/useTranslate";

const MAX_TRANSACTIONS_TO_DISPLAY = 1;

const styles = StyleSheet.create({
  checkoutItemsList: {
    marginTop: size(2),
  },
});

interface CheckoutSuccessCard {
  ids: string[];
  onCancel: () => void;
  quotaResponse: Quota | undefined;
}

const UsageQuotaTitle: FunctionComponent<{
  quantity: number;
  quotaRefreshTime: number;
}> = ({ quantity, quotaRefreshTime }) => {
  const { i18nt } = useTranslate();
  return (
    <>
      <AppText
        style={sharedStyles.statusTitle}
        accessibilityLabel="checkout-redeemedLimitReached!"
        testID="checkout-redeemedLimitReached!"
        accessible={true}
      >
        {"\n"}
        {`${i18nt("checkoutSuccessScreen", "redeemedLimitReached", undefined, {
          quantity: quantity,
          date: formatDate(quotaRefreshTime),
        })}`}
      </AppText>
    </>
  );
};

export interface TransactionsByTimeMap {
  [transactionTimeInSeconds: string]: {
    transactionTime: Date;
    transactions: Transaction[];
    order: number;
  };
}

/**
 * Given past transactions, group them by timestamp
 * If less than 1 second apart, count as same group.
 *
 * @param sortedTransactions Past transaction results sorted by transaction time in desc order
 * @param allProducts Policies
 */
export const groupTransactionsByTime = (
  sortedTransactions: PastTransactionsResult["pastTransactions"] | null,
  allProducts: CampaignPolicy[],
  translationProps: TranslationHook
): TransactionsByTimeMap => {
  const { c13nt, c13ntForUnit, i18nt } = translationProps;

  const transactionsByTimeMap: {
    [transactionTimeInSeconds: string]: {
      transactionTime: Date;
      transactions: Transaction[];
      order: number;
    };
  } = {};
  sortedTransactions?.forEach((item) => {
    const policy = allProducts?.find(
      (policy) => policy.category === item.category
    );
    const transactionTimeInSeconds = String(
      Math.floor(item.transactionTime.getTime() / 1000)
    );

    if (!transactionsByTimeMap.hasOwnProperty(transactionTimeInSeconds)) {
      transactionsByTimeMap[transactionTimeInSeconds] = {
        transactionTime: item.transactionTime,
        transactions: [],
        order: -transactionTimeInSeconds,
      };
    }
    transactionsByTimeMap[transactionTimeInSeconds].transactions.push({
      header: (policy?.name && c13nt(policy?.name)) ?? item.category,
      details: getIdentifierInputDisplay(item.identifierInputs ?? []),
      quantity: formatQuantityText(
        item.quantity,
        policy?.quantity.unit
          ? c13ntForUnit(policy?.quantity.unit)
          : {
              type: "POSTFIX",
              label: ` ${i18nt("checkoutSuccessScreen", "quantity")}`,
            }
      ),
      isAppeal: policy?.categoryType === "APPEAL",
      order: policy?.order ?? BIG_NUMBER,
    });
  });
  return transactionsByTimeMap;
};

export const sortTransactions = (
  transactionsByTimeMap: TransactionsByTimeMap
): TransactionsGroup[] => {
  return Object.entries(transactionsByTimeMap)
    .sort(([, a], [, b]) => sortTransactionsByOrder(a, b))
    .map(([, { transactionTime, transactions, order }]) => ({
      header: formatDateTime(transactionTime.getTime()),
      transactions: transactions.sort(sortTransactionsByOrder),
      order,
    }));
};

export const CheckoutSuccessCard: FunctionComponent<CheckoutSuccessCard> = ({
  ids,
  onCancel,
  quotaResponse,
}) => {
  const [isShowFullList, setIsShowFullList] = useState<boolean>(false);

  const { getProduct } = useContext(ProductContext);
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

  const productType =
    (allProducts && getProduct(allProducts[0].category)?.type) || "REDEEM";
  const { title, description } = getCheckoutMessages(
    translationProps.i18nt,
    productType
  );

  const showGlobalQuota: boolean =
    !!quotaResponse?.globalQuota &&
    !!sortedTransactions &&
    sortedTransactions.length > 0 &&
    /**
     * We only display global limit messages if there is only one global quota,
     * since we have not catered for showing global limit messages for multiple
     * categories.
     */
    allProducts?.length === 1 &&
    !!allProducts[0].quantity.usage;

  const firstGlobalQuota = showGlobalQuota
    ? quotaResponse!.globalQuota[0]
    : undefined;

  return (
    <View>
      <CustomerCard ids={ids}>
        <View style={sharedStyles.successfulResultWrapper}>
          <View style={sharedStyles.resultWrapper}>
            <FontAwesome
              name="thumbs-up"
              color={color("blue-green", 40)}
              style={sharedStyles.icon}
            />
            <AppText style={sharedStyles.statusTitleWrapper}>
              <AppText
                style={sharedStyles.statusTitle}
                accessibilityLabel="checkout-success-title"
                testID="checkout-success-title"
                accessible={true}
              >
                {title}
              </AppText>
              {showGlobalQuota && firstGlobalQuota!.quotaRefreshTime ? (
                <UsageQuotaTitle
                  quantity={firstGlobalQuota!.quantity}
                  quotaRefreshTime={firstGlobalQuota!.quotaRefreshTime}
                />
              ) : undefined}
            </AppText>
            <View>
              <AppText>{description}</AppText>
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
                    : transactionsByTimeList.slice(
                        0,
                        MAX_TRANSACTIONS_TO_DISPLAY
                      )
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
          text={translationProps.i18nt("checkoutSuccessScreen", "nextIdentity")}
          onPress={onCancel}
          fullWidth={true}
          accessibilityLabel="checkout-success-next-identity-button"
        />
      </View>
    </View>
  );
};
