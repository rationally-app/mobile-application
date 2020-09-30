import { chain, sumBy } from "lodash";
import { DailyStatistics, CampaignPolicy } from "../../types";

type SummarisedTransactions = {
  summarisedTransactionHistory: {
    name: string;
    category: string;
    quantityText: string;
  }[];
  summarisedTotalCount: number;
};

export const countTotalTransactionsAndByCategory = (
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

export const formatQuantityText = (
  quantity: number,
  unit?: CampaignPolicy["quantity"]["unit"]
): string =>
  unit
    ? unit?.type === "PREFIX"
      ? `${unit.label}${quantity.toLocaleString()}`
      : `${quantity.toLocaleString()}${unit.label}`
    : `${quantity.toLocaleString()}`;
