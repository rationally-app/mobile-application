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
    let quantityPerCategory = 0;
    transactionsByCategory[key].forEach(transaction => {
      quantityPerCategory += transaction.quantity;
    });
    summarisedTotalCount += quantityPerCategory;
    const itemWithName = policies?.find(item => item.category === key);

    summarisedTransactionHistory.push({
      name: itemWithName?.name ?? key,
      category: key,
      quantity: quantityPerCategory
    });
  });

  return { summarisedTransactionHistory, summarisedTotalCount };
};
