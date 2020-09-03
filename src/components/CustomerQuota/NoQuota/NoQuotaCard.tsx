import React, { FunctionComponent, useContext, useState } from "react";
import { differenceInSeconds, format } from "date-fns";
import { View } from "react-native";
import { CustomerCard } from "../CustomerCard";
import { AppText } from "../../Layout/AppText";
import { color } from "../../../common/styles";
import { sharedStyles } from "../sharedStyles";
import { DarkButton } from "../../Layout/Buttons/DarkButton";
import { Cart } from "../../../hooks/useCart/useCart";
import { getAllIdentifierInputDisplay } from "../../../utils/getIdentifierInputDisplay";
import { usePastTransaction } from "../../../hooks/usePastTransaction/usePastTransaction";
import { FontAwesome } from "@expo/vector-icons";
import { formatQuantityText } from "../utils";
import { styles } from "./styles";
import { TransactionsByCategory, Transaction } from "./TransactionsByCategory";
import { ShowFullListToggle } from "./ShowFullListToggle";
import {
  DistantTransactionTitle,
  RecentTransactionTitle,
  NoPreviousTransactionTitle
} from "./TransactionTitle";
import { AppealButton } from "./AppealButton";
import { CampaignConfigContext } from "../../../context/campaignConfig";
import { ProductContext } from "../../../context/products";
import { AuthContext } from "../../../context/auth";
import { Quota, PastTransactionsResult } from "../../../types";

const DURATION_THRESHOLD_SECONDS = 60 * 10; // 10 minutes
const MAX_TRANSACTIONS_TO_DISPLAY = 5;

interface NoQuotaCard {
  ids: string[];
  cart: Cart;
  onCancel: () => void;
  onAppeal?: () => void;
  quotaResponse: Quota | null;
}

export interface TransactionsByCategoryMap {
  [category: string]: {
    transactions: Transaction[];
    hasLatestTransaction?: boolean;
  };
}

const sortTransactionsByCategory = (
  a: TransactionsByCategory,
  b: TransactionsByCategory
): 1 | -1 | 0 =>
  a.category > b.category ? 1 : b.category > a.category ? -1 : 0;

/**
 * Given past transactions, group them by categories.
 *
 * @param sortedTransactions Past transaction results sorted by transaction time in desc order
 * @param allProducts Policies
 * @param latestTransactionTime Transaction time of latest transaction
 */
export const groupTransactionsByCategory = (
  sortedTransactions: PastTransactionsResult["pastTransactions"] | null,
  allProducts: Policy[],
  latestTransactionTime: Date | undefined
): TransactionsByCategoryMap => {
  const transactionsByCategoryMap: TransactionsByCategoryMap = {};
  sortedTransactions?.forEach(item => {
    const policy = allProducts?.find(
      policy => policy.category === item.category
    );
    const categoryName = policy?.name ?? item.category;
    const formattedDate = format(item.transactionTime, "d MMM yyyy, h:mma");

    if (!(categoryName in transactionsByCategoryMap)) {
      transactionsByCategoryMap[categoryName] = {
        transactions: [],
        hasLatestTransaction: false
      };
    }
    transactionsByCategoryMap[categoryName].transactions.push({
      transactionDate: formattedDate,
      details: getAllIdentifierInputDisplay(item.identifierInputs ?? []),
      quantity: formatQuantityText(
        item.quantity,
        policy?.quantity.unit || { type: "POSTFIX", label: " qty" }
      ),
      isAppeal: policy?.categoryType === "APPEAL"
    });
    transactionsByCategoryMap[categoryName].hasLatestTransaction =
      transactionsByCategoryMap[categoryName].hasLatestTransaction ||
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
): TransactionsByCategory[] => {
  const latestTransactionsByCategory: TransactionsByCategory[] = [];
  const otherTransactionsByCategory: TransactionsByCategory[] = [];
  Object.entries(transactionsByCategoryMap).forEach(([key, value]) => {
    const { transactions, hasLatestTransaction } = value;
    if (hasLatestTransaction) {
      latestTransactionsByCategory.push({
        category: key,
        transactions: transactions
      });
    } else {
      otherTransactionsByCategory.push({ category: key, transactions });
    }
  });

  latestTransactionsByCategory.sort(sortTransactionsByCategory);
  otherTransactionsByCategory.sort(sortTransactionsByCategory);

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

/**
 * Shows when the user cannot purchase anything
 *
 * Precondition: Only rendered when all items in cart have max quantity of 0
 */
export const NoQuotaCard: FunctionComponent<NoQuotaCard> = ({
  ids,
  cart,
  onCancel,
  onAppeal
}) => {
  const [isShowFullList, setIsShowFullList] = useState<boolean>(false);
  const { policies: allProducts } = useContext(CampaignConfigContext);
  const { getProduct } = useContext(ProductContext);
  const { sessionToken, endpoint } = useContext(AuthContext);
  const policyType = cart.length > 0 && getProduct(cart[0].category)?.type;

  const { pastTransactionsResult } = usePastTransaction(ids, sessionToken, endpoint);
  // Assumes results are already sorted (valid assumption for results from /transactions/history)
  const sortedTransactions = pastTransactionsResult;

  const latestTransactionTime: Date | undefined =
    sortedTransactions?.[0].transactionTime ?? undefined;
  const now = new Date();
  const secondsFromLatestTransaction = latestTransactionTime
    ? differenceInSeconds(now, latestTransactionTime)
    : -1;

  const hasAppealProduct = allProducts?.some(
    policy => policy.categoryType === "APPEAL"
  ) ?? false;

  const transactionsByCategoryMap = groupTransactionsByCategory(
    sortedTransactions,
    allProducts || [],
    latestTransactionTime
  );

  const transactionsByCategoryList = sortTransactions(
    transactionsByCategoryMap
  );

  const showGlobalQuota =
    !!quotaResponse?.globalQuota &&
    cart.length > 0 &&
    !!getProduct(cart[0].category)?.quantity.usage;

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
            {showGlobalQuota &&
              quotaResponse!.globalQuota!.map(
                ({ quantity, quotaRefreshTime }, index: number) =>
                  quotaRefreshTime ? (
                    <UsageQuotaTitle
                      key={index}
                      quantity={quantity}
                      quotaRefreshTime={quotaRefreshTime}
                    />
                  ) : undefined
              )}
          </AppText>
          {transactionsByCategoryList.length > 0 && (
            <View>
              <AppText style={styles.wrapper}>
                Item(s) {policyType === "REDEEM" ? "redeemed" : "purchased"}{" "}
                previously:
              </AppText>
              {transactionsByCategoryList.map(
                (
                  transactionsByCategory: TransactionsByCategory,
                  index: number
                ) => (
                  <TransactionsByCategory
                    key={index}
                    maxTransactionsToDisplay={
                      isShowFullList ? 99999 : MAX_TRANSACTIONS_TO_DISPLAY
                    }
                    {...transactionsByCategory}
                  />
                )
              )}
            </View>
          )}
          {sortedTransactions &&
            sortedTransactions.length > MAX_TRANSACTIONS_TO_DISPLAY && (
              <ShowFullListToggle
                toggleIsShowFullList={() => setIsShowFullList(!isShowFullList)}
                isShowFullList={isShowFullList}
              />
            )}
        </View>
      </CustomerCard>
      <View style={sharedStyles.ctaButtonsWrapper}>
        <DarkButton text="Next identity" onPress={onCancel} fullWidth={true} />
      </View>
      {onAppeal && hasAppealProduct ? (
        <AppealButton onAppeal={onAppeal} />
      ) : undefined}
    </View>
  );
};
