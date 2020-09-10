import { groupBy, forEach } from "lodash";
import { ItemQuantity } from "./types";
import { DailyStatistics } from "../../types";

export const summariseTransactions = (
  response: DailyStatistics
): ItemQuantity[] => {
  const result: ItemQuantity[] = [];

  const transactionsByCategory = groupBy(response.pastTransactions, "category");
  forEach(transactionsByCategory, (value, key) => {
    let quantity = 0;
    transactionsByCategory[key].forEach(transaction => {
      quantity += transaction.quantity;
    });
    result.push({ category: key, quantity: quantity });
  });

  return result;
};
