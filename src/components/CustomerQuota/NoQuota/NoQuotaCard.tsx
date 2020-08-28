import React, { FunctionComponent, useContext, useState } from "react";
import { differenceInSeconds, format } from "date-fns";
import { View } from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
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
import { Quota } from "../../../types";
import { Cart } from "../../../hooks/useCart/useCart";
import { CampaignConfigContext } from "../../../context/campaignConfig";
import { ProductContext } from "../../../context/products";
import { AuthContext } from "../../../context/auth";
import { usePastTransaction } from "../../../hooks/usePastTransaction/usePastTransaction";
import { getAllIdentifierInputDisplay } from "../../../utils/getIdentifierInputDisplay";
import { CustomerCard } from "../CustomerCard";
import { color } from "react-native-reanimated";
import { sharedStyles } from "../sharedStyles";
import { AppText } from "../../Layout/AppText";
import { size } from "fp-ts/lib/ReadonlyRecord";
import { DarkButton } from "../../Layout/Buttons/DarkButton";

const DURATION_THRESHOLD_SECONDS = 60 * 10; // 10 minutes
const MAX_TRANSACTIONS_TO_DISPLAY = 5;

interface NoQuotaCard {
  ids: string[];
  cart: Cart;
  onCancel: () => void;
  onAppeal?: () => void;
  quotaResponse: Quota | null;
}
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

  const policyType = cart.length > 0 && getProduct(cart[0].category)?.type;

  const { pastTransactionsResult } = usePastTransaction(
    ids,
    sessionToken,
    endpoint
  );
  // Assumes results are already sorted (valid assumption for results from /transactions/history)
  const sortedTransactions = pastTransactionsResult?.pastTransactions;

  const latestTransactionTime: Date | undefined =
    sortedTransactions?.[0].transactionTime ?? undefined;
  const now = new Date();
  const secondsFromLatestTransaction = latestTransactionTime
    ? differenceInSeconds(now, latestTransactionTime)
    : -1;

  const hasAppealProduct = (): boolean => {
    return (
      allProducts?.some(policy => policy.categoryType === "APPEAL") ?? false
    );
  };

  // Group transactions by category
  const transactionsByCategoryMap: {
    [category: string]: {
      transactions: Transaction[];
      hasLatestTransaction?: boolean;
    };
  } = {};
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
      )
    });
    // TODO: check if seconds is good, or need to change to minutes
    transactionsByCategoryMap[categoryName].hasLatestTransaction =
      transactionsByCategoryMap[categoryName].hasLatestTransaction ||
      differenceInSeconds(latestTransactionTime || 0, item.transactionTime) ===
        0;
  });

  // Split categories into those with the latest transactions and those without
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

  // Order each category list by alphabetical order
  const sortTransactionsByCategory = (
    a: TransactionsByCategory,
    b: TransactionsByCategory
  ): 1 | -1 | 0 =>
    a.category > b.category ? 1 : b.category > a.category ? -1 : 0;
  latestTransactionsByCategory.sort(sortTransactionsByCategory);
  otherTransactionsByCategory.sort(sortTransactionsByCategory);

  // Concat category lists into a single list
  // Add order to each transaction for "Show more" feature
  let transactionCounter = 0;
  const transactionsByCategoryList = latestTransactionsByCategory
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
          {transactionCounter > MAX_TRANSACTIONS_TO_DISPLAY && (
            <ShowFullListToggle
              onClick={() => setIsShowFullList(!isShowFullList)}
              displayText={isShowFullList ? "Show less" : "Show more"}
              icon={
                <Ionicons
                  name={
                    isShowFullList
                      ? "ios-arrow-dropup-circle"
                      : "ios-arrow-dropdown-circle"
                  }
                  size={size(4)}
                  color={color("blue", 50)}
                />
              }
            />
          )}
        </View>
      </CustomerCard>
      <View style={sharedStyles.ctaButtonsWrapper}>
        <DarkButton text="Next identity" onPress={onCancel} fullWidth={true} />
      </View>
      {onAppeal && hasAppealProduct() ? (
        <AppealButton onAppeal={onAppeal} />
      ) : undefined}
    </View>
  );
};
