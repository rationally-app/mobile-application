import { chain, sumBy } from "lodash";
import { DailyStatistics, CampaignPolicy } from "../../types";
import { formatQuantityText } from "../../components/CustomerQuota/utils";

type SummarisedTransactions = {
  summarisedTransactionHistory: {
    name: string;
    category: string;
    quantityText: string;
  }[];
  summarisedTotalCount: number;
};

export const countTotalTransactionsAndByCategory = (
  transactions: DailyStatistics[],
  policies: CampaignPolicy[] | null
): SummarisedTransactions => {
  return chain(transactions)
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
          quantityText: formatQuantityText(
            totalQuantityInCategory,
            policies?.find(item => item.category === key)?.quantity.unit || {
              type: "POSTFIX",
              label: " qty"
            }
          )
        });
        prev.summarisedTotalCount += totalQuantityInCategory;
        return prev;
      },
      { summarisedTransactionHistory: [], summarisedTotalCount: 0 }
    )
    .value();
};
