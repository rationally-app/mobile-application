import { useEffect, useState } from "react";
import { PastTransactionsResult } from "../../types";
import { usePrevious } from "../usePrevious";
import {
  getPastTransactions,
  PastTransactionError
} from "../../services/quota";
import { Sentry } from "../../utils/errorTracking";
import { ERROR_MESSAGE } from "../../context/alert";

export type PastTransactionHook = {
  pastTransactionsResult: PastTransactionsResult["pastTransactions"] | null;
  loading: boolean;
  error: PastTransactionError | null;
};

export const usePastTransaction = (
  ids: string[],
  authKey: string,
  endpoint: string
): PastTransactionHook => {
  const [pastTransactionsResult, setPastTransactionsResult] = useState<
    PastTransactionsResult["pastTransactions"] | null
  >(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<PastTransactionError | null>(null);
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
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (prevIds !== ids) {
      setLoading(true);
      setError(null);
      fetchPastTransactions();
    }
  }, [authKey, endpoint, ids, prevIds]);

  return {
    pastTransactionsResult,
    loading,
    error
  };
};
