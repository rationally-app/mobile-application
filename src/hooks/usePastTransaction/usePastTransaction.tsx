import { useEffect, useState, useContext, useCallback } from "react";
import { PastTransactionsResult } from "../../types";
import { usePrevious } from "../usePrevious";
import {
  getPastTransactions,
  PastTransactionError,
} from "../../services/quota";
import { Sentry } from "../../utils/errorTracking";
import { ERROR_MESSAGE } from "../../context/alert";
import { IdentificationContext } from "../../context/identification";

export type PastTransactionHook = {
  updateCategories: (categories: string[]) => void;
  resetCategories: () => void;
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
  const { selectedIdType } = useContext(IdentificationContext);
  const [categories, setCategories] = useState<string[]>();

  /**
   * Updates what category of transactions to retrieve history for
   */
  const updateCategories: PastTransactionHook["updateCategories"] = useCallback(
    (categories) => {
      if (categories.length > 0) {
        setCategories(categories);
      } else {
        setCategories(undefined);
      }
    },
    []
  );

  const resetCategories: PastTransactionHook["resetCategories"] = useCallback(() => {
    setCategories(undefined);
  }, []);

  useEffect(() => {
    const fetchPastTransactions = async (): Promise<void> => {
      try {
        const pastTransactionsResponse = await getPastTransactions(
          ids,
          selectedIdType,
          authKey,
          endpoint,
          categories
        );
        setPastTransactionsResult(pastTransactionsResponse?.pastTransactions);
      } catch (error) {
        Sentry.captureException(
          `Unable to fetch past transactions: ${ids.map((id) =>
            id.slice(-4).padStart(id.length, "*")
          )}`
        );
        setError(
          new PastTransactionError(ERROR_MESSAGE.PAST_TRANSACTIONS_ERROR)
        );
      } finally {
        setLoading(false);
      }
    };

    if (prevIds !== ids) {
      setLoading(true);
      setError(null);
      fetchPastTransactions();
    }
  }, [authKey, endpoint, ids, selectedIdType, prevIds, categories]);

  return {
    updateCategories,
    resetCategories,
    pastTransactionsResult,
    loading,
    error,
  };
};
