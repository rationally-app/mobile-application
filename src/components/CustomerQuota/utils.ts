import { differenceInSeconds } from "date-fns";
import { Transaction, TransactionsGroup } from "./TransactionsGroup";
import {
  CampaignPolicy,
  PastTransactionsResult,
  PolicyIdentifier,
} from "../../types";
import { getIdentifierInputDisplay } from "../../utils/getIdentifierInputDisplay";
import { formatDateTime } from "../../utils/dateTimeFormatter";
import { TranslationHook } from "../../hooks/useTranslate/useTranslate";
import { CartItem } from "../../hooks/useCart/useCart";
import { validate as validatePassport } from "../../utils/validatePassport";

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

/**
 * Check if the campaign contains tt-token
 * to indicate pod campaign
 *
 * @param cartItemCategory category of item
 */
export const isPodCampaign = (cartItemCategory: string): boolean =>
  cartItemCategory.includes("tt-token");

/**
 * Check if pod is chargeable.
 *
 * Redemption of the first token is chargeable for passport customer.
 *
 * @param id customerId
 * @param identifiers policy identifiers
 * @param cartItem policy cart item
 */
export const isPodChargeable = (
  id: string,
  identifiers: PolicyIdentifier[],
  cartItem: CartItem
): boolean => {
  if (identifiers.length > 0) {
    if (cartItem.category.includes("tt-token-lost")) {
      if (cartItem.descriptionAlert === "*chargeable") {
        return true;
      }
    } else if (validatePassport(id)) {
      if (cartItem.category.includes("tt-token")) {
        return true;
      }
    }
  }
  return false;
};

/**
 * Filters out the payment receipt identifier if not required
 * which happens when pod is not chargeable
 * Shape of identifiers and cartItem.identifierInputs are slightly different and
 * hence require to filter separately
 *
 * @param identifiers identifiers that can be modified
 * @param cartItem cartItem containing identifiers that can be modified
 */
export const removePaymentReceiptField = (
  identifiers: PolicyIdentifier[],
  cartItem: CartItem
): {
  newIdentifiers: PolicyIdentifier[];
  newCartItem: CartItem;
} => {
  identifiers = identifiers.filter(
    (identifier: { label: string }) =>
      identifier.label != "Payment receipt number"
  );
  cartItem.identifierInputs = cartItem.identifierInputs.filter(
    (identifier) => identifier.label != "Payment receipt number"
  );

  return { newIdentifiers: identifiers, newCartItem: cartItem };
};
