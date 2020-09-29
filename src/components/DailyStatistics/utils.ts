import { chain, sumBy } from "lodash";
import { DailyStatistics, CampaignPolicy } from "../../types";

type SummarisedTransactions = {
  summarisedTransactionHistory: {
    name: string;
    category: string;
    quantity: number;
  }[];
  summarisedTotalCount: number;
};

export const summariseTransactions = (
  response: DailyStatistics,
  policies: CampaignPolicy[] | null
): SummarisedTransactions => {
  return chain(response.pastTransactions)
    .groupBy("category")
    .reduce<SummarisedTransactions>(
      (prev, transactionsByCategory, key) => {
        const totalQuantityInCategory = sumBy(
          transactionsByCategory,
          "quantity"
        );
        prev.summarisedTransactionHistory.push({
          name: policies?.find(item => item.category === key)?.name ?? key,
          category: key,
          quantity: totalQuantityInCategory
        });
        prev.summarisedTotalCount += totalQuantityInCategory;
        return prev;
      },
      { summarisedTransactionHistory: [], summarisedTotalCount: 0 }
    )
    .value();
};
