import { groupBy, forEach } from "lodash";
import { DailyStatistics, CampaignPolicy } from "../../types";

export const summariseTransactions = (
  response: DailyStatistics,
  policies: CampaignPolicy[] | null
): {
  summarisedTransactionHistory: {
    name: string;
    category: string;
    quantity: number;
  }[];
  summarisedTotalCount: number;
} => {
  const summarisedTransactionHistory: {
    name: string;
    category: string;
    quantity: number;
  }[] = [];
  let summarisedTotalCount = 0;

  const transactionsByCategory = groupBy(response.pastTransactions, "category");
  forEach(transactionsByCategory, (value, key) => {
    let quantity = 0;
    transactionsByCategory[key].forEach(transaction => {
      quantity += transaction.quantity;
    });
    summarisedTotalCount += quantity;
    const itemWithName = policies?.find(item => {
      if (item.category === key) {
        return item;
      }
    });

    summarisedTransactionHistory.push({
      name: itemWithName ? itemWithName.name : key,
      category: key,
      quantity: quantity
    });
  });

  return { summarisedTransactionHistory, summarisedTotalCount };
};
