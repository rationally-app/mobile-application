import { groupBy, forEach } from "lodash";
import { ItemQuantity } from "./types";
import { DailyStatistics } from "../../types";

export const summariseTransactions = (
  response: DailyStatistics
): {
  summarisedTransactionHistory: ItemQuantity[];
  summarisedTotalCount: number;
} => {
  const summarisedTransactionHistory: ItemQuantity[] = [];
  let summarisedTotalCount = 0;

  const transactionsByCategory = groupBy(response.pastTransactions, "category");
  forEach(transactionsByCategory, (value, key) => {
    let quantity = 0;
    transactionsByCategory[key].forEach(transaction => {
      quantity += transaction.quantity;
    });
    summarisedTotalCount += quantity;
    summarisedTransactionHistory.push({ category: key, quantity: quantity });
  });

  return { summarisedTransactionHistory, summarisedTotalCount };
};
