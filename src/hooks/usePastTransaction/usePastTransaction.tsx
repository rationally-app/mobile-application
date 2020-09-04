import { useEffect, useState } from "react";
import { PastTransactionsResult } from "../../types";
import { usePrevious } from "../usePrevious";
import { getPastTransactions } from "../../services/quota";
import { Sentry } from "../../utils/errorTracking";
import { ERROR_MESSAGE } from "../../context/alert";

export type PastTransactionHook = {
  pastTransactionsResult: PastTransactionsResult["pastTransactions"] | null;
  error: { message: string } | null;
};

export const usePastTransaction = (
  ids: string[],
  authKey: string,
  endpoint: string
): PastTransactionHook => {
  const [pastTransactionsResult, setPastTransactionsResult] = useState<
    PastTransactionsResult["pastTransactions"] | null
  >(null);
  const [error, setError] = useState<{ message: string } | null>(null);
  const prevIds = usePrevious(ids);

  useEffect(() => {
    const fetchPastTransactions = async (): Promise<void> => {
      try {
        const pastTransactionsResponse = await getPastTransactions(
          ids,
          authKey,
          endpoint
        );
        setPastTransactionsResult(pastTransactionsResponse?.pastTransactions);
      } catch (error) {
        Sentry.captureException(`Unable to fetch past transactions: ${ids}`);
        setError(new Error(ERROR_MESSAGE.PAST_TRANSACTIONS_ERROR));
      }
    };

    if (
      typeof prevIds !== typeof ids ||
      (prevIds && ids && !prevIds.every(id => ids.includes(id)))
    ) {
      fetchPastTransactions();
    }
  }, [authKey, endpoint, ids, prevIds]);

  return {
    pastTransactionsResult,
    error
  };
};
