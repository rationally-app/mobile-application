import { chain, sumBy } from "lodash";
import { DailyStatistics, CampaignPolicy } from "../../types";
import { formatQuantityText } from "../../components/CustomerQuota/utils";
import { Sentry } from "../../utils/errorTracking";
import { TranslationHook } from "../useTranslate/useTranslate";

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
  policies: CampaignPolicy[] | null,
  translationProps: TranslationHook
): SummarisedTransactions => {
  const { i18nt, c13ntForUnit } = translationProps;

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
            findItemByCategory?.quantity.unit
              ? c13ntForUnit(findItemByCategory?.quantity.unit)
              : {
                  type: "POSTFIX",
                  label: ` ${i18nt("checkoutSuccessScreen", "quantity")}`,
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
