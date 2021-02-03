import { differenceInSeconds } from "date-fns";
import { Transaction, TransactionsGroup } from "./TransactionsGroup";
import { CampaignPolicy, PastTransactionsResult } from "../../types";
import { getIdentifierInputDisplay } from "../../utils/getIdentifierInputDisplay";
import { formatDateTime } from "../../utils/dateTimeFormatter";
import { TranslationHook } from "../../hooks/useTranslate/useTranslate";

export const BIG_NUMBER = 99999;

export interface TransactionsByCategoryMap {
  [category: string]: {
    transactions: Transaction[];
    order: number;
    hasLatestTransaction: boolean;
  };
}

export const formatQuantityText = (
  quantity: number,
  unit?: CampaignPolicy["quantity"]["unit"]
): string =>
  unit
    ? unit?.type === "PREFIX"
      ? `${unit.label}${quantity.toLocaleString()}`
      : `${quantity.toLocaleString()}${unit.label}`
    : `${quantity.toLocaleString()}`;

export const sortTransactionsByOrder = (
  a: { order: number },
  b: { order: number }
): number => a.order - b.order;

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
export const sortTransactionsByCategory = (
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
        order,
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
    .map((transactionsByCategory) => {
      const orderedTransactions = transactionsByCategory.transactions.map(
        (transaction) => {
          const result = { ...transaction, order: transactionCounter };
          transactionCounter += 1;
          return result;
        }
      );
      return { ...transactionsByCategory, transactions: orderedTransactions };
    });
};

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
  sortedTransactions?.forEach((item) => {
    const policy = allProducts?.find(
      (policy) => policy.category === item.category
    );
    const tName = (policy?.name && c13nt(policy?.name)) ?? c13nt(item.category);
    const formattedDate = formatDateTime(item.transactionTime);

    if (!transactionsByCategoryMap.hasOwnProperty(tName)) {
      transactionsByCategoryMap[tName] = {
        transactions: [],
        hasLatestTransaction: false,
        order: policy?.order ?? BIG_NUMBER,
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
              label: ` ${i18nt("checkoutSuccessScreen", "quantity")}`,
            }
      ),
      isAppeal: policy?.categoryType === "APPEAL",
      order: -1,
    });
    transactionsByCategoryMap[tName].hasLatestTransaction =
      transactionsByCategoryMap[tName].hasLatestTransaction ||
      differenceInSeconds(latestTransactionTime || 0, item.transactionTime) ===
        0;
  });

  return transactionsByCategoryMap;
};
