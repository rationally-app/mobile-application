import chain from "lodash/chain";
import sumBy from "lodash/sumBy";
import { DailyStatistics, CampaignPolicy } from "../../types";
import { formatQuantityText } from "../../components/CustomerQuota/utils";
import { Sentry } from "../../utils/errorTracking";

type SummarisedTransactions = {
  summarisedTransactionHistory: {
    name: string;
    category: string;
    quantityText: string;
    descriptionAlert?: string;
    order: number;
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
        const findItemByCategory = policies?.find(
          (item) => item.category === key
        );
        const totalQuantityInCategory = sumBy(
          transactionsByCategory,
          "quantity"
        );
        prev.summarisedTransactionHistory.push({
          name:
            findItemByCategory?.name ??
            (() => {
              Sentry.captureException(
                `Unable to find item category in policies: ${key}}`
              );
              return key;
            })(),
          category: key,
          quantityText: formatQuantityText(
            totalQuantityInCategory,
            findItemByCategory?.quantity.unit || {
              type: "POSTFIX",
              label: " qty",
            }
          ),
          descriptionAlert:
            findItemByCategory?.categoryType === "APPEAL"
              ? "via appeal"
              : undefined,
          order: findItemByCategory?.order ?? -1,
        });
        prev.summarisedTotalCount += totalQuantityInCategory;
        return prev;
      },
      { summarisedTransactionHistory: [], summarisedTotalCount: 0 }
    )
    .value();
};
