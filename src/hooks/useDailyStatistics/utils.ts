import { chain, sumBy } from "lodash";
import { DailyStatistics, CampaignPolicy } from "../../types";
import { Sentry } from "../../utils/errorTracking";
import { i18ntWithValidator } from "../useTranslate/useTranslate";

export type UnitType =
  | {
      type: "POSTFIX" | "PREFIX";
      label: string;
    }
  | undefined;

export type Transaction = {
  name: string;
  category: string;
  quantity: number;
  unitType: UnitType;
  descriptionAlert?: string;
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
          unitType: findItemByCategory?.quantity.unit,
          descriptionAlert:
            findItemByCategory?.categoryType === "APPEAL"
              ? i18ntWithValidator("redemptionStats", "viaAppeal")
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
