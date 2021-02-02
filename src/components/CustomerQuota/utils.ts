import { CampaignPolicy, PastTransactionsResult, Quota } from "../../types";
import { differenceInSeconds, compareDesc } from "date-fns";
import { TranslationHook } from "../../hooks/useTranslate/useTranslate";
import { Cart } from "../../hooks/useCart/useCart";
import { getIdentifierInputDisplay } from "../../utils/getIdentifierInputDisplay";
import { formatDateTime } from "../../utils/dateTimeFormatter";
import { Transaction, TransactionsGroup } from "./TransactionsGroup";

export const BIG_NUMBER = 99999;

export interface TransactionsByTimeMap {
  [transactionTimeInSeconds: string]: {
    transactionTime: Date;
    transactions: Transaction[];
    order: number;
  };
}

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

/**
 * Checks whether quotaResponse contains some category with APPEAL type and
 * quantity not equal to zero
 *
 * @param allProducts Policies
 * @param allQuotaResponse Complete quota response (remaining, local, global)
 */
export const checkHasAppealProduct = (
  allProducts: CampaignPolicy[] | null,
  allQuotaResponse: Quota | undefined
): boolean => {
  const appealProductsCategories = allProducts
    ?.filter((product) => product.categoryType === "APPEAL")
    .map((product) => product.category);

  const hasAppealProduct =
    (appealProductsCategories &&
      allQuotaResponse?.remainingQuota.some(
        (quota) =>
          appealProductsCategories.includes(quota.category) &&
          quota.quantity !== 0
      )) ??
    false;
  return hasAppealProduct;
};

export const getLatestTransactionTime = (cart: Cart): Date | undefined => {
  cart.sort((item1, item2) =>
    compareDesc(item1.lastTransactionTime ?? 0, item2.lastTransactionTime ?? 0)
  );

  return cart[0]?.lastTransactionTime;
};

export const sortTransactionsByOrder = (
  a: { order: number },
  b: { order: number }
): number => a.order - b.order;

/**
 * Transforms map of transactions into an array
 * Array is sorted by:
 *  1. Timestamp
 * Each group is sorted by the timestamp from latest to oldest
 * The transactions are sorted by the order number
 *
 * @param transactionsByTimeMap Transactions by time
 */
export const sortTransactionsByTime = (
  transactionsByTimeMap: TransactionsByTimeMap
): TransactionsGroup[] => {
  return Object.entries(transactionsByTimeMap)
    .sort(([, a], [, b]) => sortTransactionsByOrder(a, b))
    .map(([, { transactionTime, transactions, order }]) => {
      transactions.sort(sortTransactionsByOrder);

      return {
        header: formatDateTime(transactionTime.getTime()),
        transactions,
        order,
      };
    });
};

/**
 * Transforms map of transactions into an array
 * Array is sorted by:
 *  1. Categories with latest transactions
 *  2. All other categories
 * Each group is sorted by category name in ascending order
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
    const tName = (policy?.name && c13nt(policy?.name)) ?? item.category;
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
