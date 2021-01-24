import { chain, sumBy } from "lodash";
import { DailyStatistics, CampaignPolicy } from "../../types";
import { Sentry } from "../../utils/errorTracking";

export type UnitType = 
    |{
      type: "POSTFIX" | "PREFIX";
      label: string;
    }
    |{ type: "POSTFIX", label: " qty"};

export type Transaction = {
  name: string;
  category: string;
  quantity: number;
  unitType: UnitType;
  descriptionAlert?: "viaAppeal" | undefined;
  order: number;
};

type SummarisedTransactions = {
  summarisedTransactionHistory: Transaction[];
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
          quantity: totalQuantityInCategory,
          unitType: findItemByCategory?.quantity.unit || {
            type: "POSTFIX",
            label: " qty",
          },
          // categoryType: findItemByCategory?.categoryType,
          descriptionAlert:
            findItemByCategory?.categoryType === "APPEAL"
              ? "viaAppeal"
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
