import React, { FunctionComponent, useState, useContext } from "react";
import { differenceInSeconds, format } from "date-fns";
import { View } from "react-native";
import { CustomerCard } from "../CustomerCard";
import { AppText } from "../../Layout/AppText";
import { color, size } from "../../../common/styles";
import { sharedStyles } from "../sharedStyles";
import { DarkButton } from "../../Layout/Buttons/DarkButton";
import { Cart } from "../../../hooks/useCart/useCart";
import { getAllIdentifierInputDisplay } from "../../../utils/getIdentifierInputDisplay";
import { usePastTransaction } from "../../../hooks/usePastTransaction/usePastTransaction";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { formatQuantityText } from "../utils";
import { styles } from "./styles";
import { TransactionsGroup, Transaction } from "../TransactionsGroup";
import { ShowFullListToggle } from "../ShowFullListToggle";
import {
  DistantTransactionTitle,
  RecentTransactionTitle,
  NoPreviousTransactionTitle
} from "./TransactionTitle";
import { AppealButton } from "./AppealButton";
import { CampaignConfigContext } from "../../../context/campaignConfig";
import { ProductContext } from "../../../context/products";
import { AuthContext } from "../../../context/auth";

const DURATION_THRESHOLD_SECONDS = 60 * 10; // 10 minutes
const MAX_TRANSACTIONS_TO_DISPLAY = 5;

interface NoQuotaCard {
  ids: string[];
  cart: Cart;
  onCancel: () => void;
  onAppeal?: () => void;
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

  const { pastTransactionsResult } = usePastTransaction(
    ids,
    sessionToken,
    endpoint
  );
  // Assumes results are already sorted (valid assumption for results from /transactions/history)
  const sortedTransactions = pastTransactionsResult;

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
      header: formattedDate,
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
  const latestTransactionsByCategory: TransactionsGroup[] = [];
  const otherTransactionsByCategory: TransactionsGroup[] = [];
  Object.entries(transactionsByCategoryMap).forEach(([key, value]) => {
    const { transactions, hasLatestTransaction } = value;
    const newTransactions = {
      header: key,
      transactions: transactions
    };
    if (hasLatestTransaction) {
      latestTransactionsByCategory.push(newTransactions);
    } else {
      otherTransactionsByCategory.push(newTransactions);
    }
  });

  latestTransactionsByCategory.sort(sortTransactionsByCategory);
  otherTransactionsByCategory.sort(sortTransactionsByCategory);

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
                />
              ) : (
                <RecentTransactionTitle
                  now={now}
                  transactionTime={latestTransactionTime!}
                />
              )
            ) : (
              <NoPreviousTransactionTitle />
            )}
          </AppText>
          {transactionsByCategoryList.length > 0 && (
            <View>
              <AppText style={styles.wrapper}>
                Item(s) {policyType === "REDEEM" ? "redeemed" : "purchased"}{" "}
                previously:
              </AppText>
              {transactionsByCategoryList.map(
                (transactionsByCategory: TransactionsGroup, index: number) => (
                  <TransactionsGroup
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
