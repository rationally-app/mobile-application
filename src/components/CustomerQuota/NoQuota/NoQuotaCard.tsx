import React, {
  FunctionComponent,
  useState,
  useContext,
  useEffect
} from "react";
import { differenceInSeconds, compareDesc } from "date-fns";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { CustomerCard } from "../CustomerCard";
import { AppText } from "../../Layout/AppText";
import { color, size } from "../../../common/styles";
import { sharedStyles } from "../sharedStyles";
import { DarkButton } from "../../Layout/Buttons/DarkButton";
import { Cart, useCart } from "../../../hooks/useCart/useCart";
import { usePastTransaction } from "../../../hooks/usePastTransaction/usePastTransaction";
import { FontAwesome } from "@expo/vector-icons";
import {
  formatQuantityText,
  BIG_NUMBER,
  sortTransactionsByOrder
} from "../utils";
import { TransactionsGroup, Transaction } from "../TransactionsGroup";
import { ShowFullListToggle } from "../ShowFullListToggle";
import {
  DistantTransactionTitle,
  RecentTransactionTitle,
  NoPreviousTransactionTitle,
  UsageQuotaTitle
} from "./TransactionTitle";
import { AppealButton } from "./AppealButton";
import { getIdentifierInputDisplay } from "../../../utils/getIdentifierInputDisplay";
import { Quota, PastTransactionsResult, CampaignPolicy } from "../../../types";
import { AlertModalContext } from "../../../context/alert";
import { CampaignConfigContext } from "../../../context/campaignConfig";
import { ProductContext } from "../../../context/products";
import { AuthContext } from "../../../context/auth";
import { formatDateTime } from "../../../utils/dateTimeFormatter";
import {
  TranslationHook,
  useTranslate
} from "../../../hooks/useTranslate/useTranslate";

const DURATION_THRESHOLD_SECONDS = 60 * 10; // 10 minutes
const MAX_TRANSACTIONS_TO_DISPLAY = 5;

export const styles = StyleSheet.create({
  wrapper: {
    marginTop: size(2),
    marginBottom: size(2)
  }
});

export interface TransactionsByCategoryMap {
  [category: string]: {
    transactions: Transaction[];
    order: number;
    hasLatestTransaction: boolean;
  };
}

interface NoQuotaCard {
  ids: string[];
  cart: Cart;
  onCancel: () => void;
  onAppeal?: () => void;
  quotaResponse: Quota | null;
}

/**
 * Given past transactions, group them by categories.
 *
 * @param sortedTransactions Past transaction results sorted by transaction time in desc order
 * @param allProducts Policies
 * @param latestTransactionTime Transaction time of latest transaction
 */
export const groupTransactionsByCategory = (
  sortedTransactions: PastTransactionsResult["pastTransactions"] | null,
  allProducts: CampaignPolicy[],
  latestTransactionTime: Date | undefined,
  translationProps: TranslationHook
): TransactionsByCategoryMap => {
  const { c13nt, c13ntForUnit, i18nt } = translationProps;

  // Group transactions by category
  const transactionsByCategoryMap: TransactionsByCategoryMap = {};
  sortedTransactions?.forEach(item => {
    const policy = allProducts?.find(
      policy => policy.category === item.category
    );
    const tName = (policy?.name && c13nt(policy?.name)) ?? item.category;
    const formattedDate = formatDateTime(item.transactionTime);

    if (!transactionsByCategoryMap.hasOwnProperty(tName)) {
      transactionsByCategoryMap[tName] = {
        transactions: [],
        hasLatestTransaction: false,
        order: policy?.order ?? BIG_NUMBER
      };
    }
    transactionsByCategoryMap[tName].transactions.push({
      header: formattedDate,
      details: getIdentifierInputDisplay(item.identifierInputs ?? []),
      quantity: formatQuantityText(
        item.quantity,
        policy?.quantity.unit
          ? c13ntForUnit(policy?.quantity.unit)
          : {
              type: "POSTFIX",
              label: ` ${i18nt("checkoutSuccessScreen", "quantity")}`
            }
      ),
      isAppeal: policy?.categoryType === "APPEAL",
      order: -1
    });
    transactionsByCategoryMap[tName].hasLatestTransaction =
      transactionsByCategoryMap[tName].hasLatestTransaction ||
      differenceInSeconds(latestTransactionTime || 0, item.transactionTime) ===
        0;
  });

  return transactionsByCategoryMap;
};

/**
 * Transforms map of transactions into an array
 * Array is sorted by:
 *  1. Categories with latest transactions
 *  2. All other categories
 * Each group is sorted by category name in asc order
 * Also adds an order attribute to each transaction for the "Show more" feature
 *
 * @param transactionsByCategoryMap Transactions by category
 */
export const sortTransactions = (
  transactionsByCategoryMap: TransactionsByCategoryMap
): TransactionsGroup[] => {
  const latestTransactionsByCategory: TransactionsGroup[] = [];
  const otherTransactionsByCategory: TransactionsGroup[] = [];
  Object.entries(transactionsByCategoryMap).forEach(([key, value]) => {
    const { transactions, hasLatestTransaction, order } = value;
    if (hasLatestTransaction) {
      latestTransactionsByCategory.push({
        header: key,
        transactions,
        order
      });
    } else {
      otherTransactionsByCategory.push({ header: key, transactions, order });
    }
  });

  latestTransactionsByCategory.sort(sortTransactionsByOrder);
  otherTransactionsByCategory.sort(sortTransactionsByOrder);

  let transactionCounter = 0;
  return latestTransactionsByCategory
    .concat(otherTransactionsByCategory)
    .map(transactionsByCategory => {
      const orderedTransactions = transactionsByCategory.transactions.map(
        transaction => {
          const result = { ...transaction, order: transactionCounter };
          transactionCounter += 1;
          return result;
        }
      );
      return { ...transactionsByCategory, transactions: orderedTransactions };
    });
};

export const getLatestTransactionTime = (cart: Cart): Date | undefined =>
  cart.sort((item1, item2) =>
    compareDesc(item1.lastTransactionTime ?? 0, item2.lastTransactionTime ?? 0)
  )[0]?.lastTransactionTime;

/**
 * Shows when the user cannot purchase anything
 *
 * Precondition: Only rendered when all items in cart have max quantity of 0
 */
export const NoQuotaCard: FunctionComponent<NoQuotaCard> = ({
  ids,
  cart,
  onCancel,
  onAppeal,
  quotaResponse
}) => {
  const [isShowFullList, setIsShowFullList] = useState<boolean>(false);
  const { policies: allProducts } = useContext(CampaignConfigContext);
  const { getProduct } = useContext(ProductContext);
  const { sessionToken, endpoint } = useContext(AuthContext);
  const { allQuotaResponse } = useCart(ids, sessionToken, endpoint);

  const policyType = cart.length > 0 && getProduct(cart[0].category)?.type;

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

  const now = new Date();
  const secondsFromLatestTransaction = latestTransactionTime
    ? differenceInSeconds(now, latestTransactionTime)
    : -1;

  const hasAppealProduct =
    allQuotaResponse?.remainingQuota.some(policy => policy.quantity !== 0) ??
    false;

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

  const showGlobalQuota =
    !!quotaResponse?.globalQuota &&
    cart.length > 0 &&
    /**
     * We only display global limit messages if there is only one category for now
     */
    allProducts?.length === 1 &&
    !!allProducts[0].quantity.usage;

  const firstGlobalQuota = showGlobalQuota
    ? quotaResponse!.globalQuota![0]
    : undefined;

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
            <AppText style={sharedStyles.statusTitleWrapper}>
              {secondsFromLatestTransaction > 0 ? (
                secondsFromLatestTransaction > DURATION_THRESHOLD_SECONDS ? (
                  <DistantTransactionTitle
                    transactionTime={latestTransactionTime!}
                    toggleTimeSensitiveTitle={showGlobalQuota}
                  />
                ) : (
                  <RecentTransactionTitle
                    now={now}
                    transactionTime={latestTransactionTime!}
                    toggleTimeSensitiveTitle={showGlobalQuota}
                  />
                )
              ) : (
                <NoPreviousTransactionTitle
                  toggleTimeSensitiveTitle={showGlobalQuota}
                />
              )}
              {showGlobalQuota && firstGlobalQuota!.quotaRefreshTime ? (
                <UsageQuotaTitle
                  quantity={firstGlobalQuota!.quantity}
                  quotaRefreshTime={firstGlobalQuota!.quotaRefreshTime}
                />
              ) : undefined}
            </AppText>
            {loading ? (
              <ActivityIndicator
                style={{ alignSelf: "flex-start" }}
                size="large"
                color={color("grey", 40)}
              />
            ) : (
              transactionsByCategoryList.length > 0 && (
                <View>
                  <AppText style={styles.wrapper}>
                    {policyType === "REDEEM"
                      ? `${translationProps.i18nt(
                          "checkoutSuccessScreen",
                          "previouslyRedeemedItems"
                        )}:`
                      : `${translationProps.i18nt(
                          "checkoutSuccessScreen",
                          "previouslyPurchasedItems"
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
              )
            )}
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
          text={translationProps.i18nt(
            "checkoutSuccessScreen",
            "redeemedNextIdentity"
          )}
          onPress={onCancel}
          fullWidth={true}
        />
      </View>
      {onAppeal && hasAppealProduct ? (
        <AppealButton onAppeal={onAppeal} />
      ) : undefined}
    </View>
  );
};
