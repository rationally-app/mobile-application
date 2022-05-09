import { useEffect, useState, useContext } from "react";
import { PastTransactionsResult } from "../../types";
import { usePrevious } from "../usePrevious";
import { useIsMounted } from "../useIsMounted";
import {
  getPastTransactions,
  PastTransactionError,
} from "../../services/quota";
import { Sentry } from "../../utils/errorTracking";
import { ERROR_MESSAGE } from "../../context/alert";
import { IdentificationContext } from "../../context/identification";
import { CampaignConfigContext } from "../../context/campaignConfig";
import { NetworkError } from "../../services/helpers";

export type PastTransactionHook = {
  pastTransactionsResult: PastTransactionsResult["pastTransactions"] | null;
  loading: boolean;
  error: PastTransactionError | null;
};

export const usePastTransaction = (
  ids: string[],
  authKey: string,
  endpoint: string,
  categories?: string[],
  getAllTransactions = false
): PastTransactionHook => {
  const isMounted = useIsMounted();
  const [pastTransactionsResult, setPastTransactionsResult] = useState<
    PastTransactionsResult["pastTransactions"] | null
  >(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<PastTransactionError | null>(null);
  const prevIds = usePrevious(ids);
  const { selectedIdType } = useContext(IdentificationContext);
  const { features } = useContext(CampaignConfigContext);

  useEffect(() => {
    const fetchPastTransactions = async (): Promise<void> => {
      Sentry.addBreadcrumb({
        category: "fetchPastTransactions",
        message: JSON.stringify({
          ids: ids.map((id) => id.slice(-4).padStart(id.length, "*")),
        }),
      });
      try {
        const pastTransactionsResponse = await getPastTransactions(
          ids,
          selectedIdType,
          authKey,
          endpoint,
          categories,
          getAllTransactions,
          features?.apiVersion
        );
        if (isMounted()) {
          setPastTransactionsResult(pastTransactionsResponse?.pastTransactions);
        }
      } catch (error) {
        Sentry.captureException("Unable to fetch past transactions");
        if (error instanceof NetworkError) {
          setError(error);
        } else {
          setError(
            new PastTransactionError(ERROR_MESSAGE.PAST_TRANSACTIONS_ERROR)
          );
        }
      } finally {
        if (isMounted()) {
          setLoading(false);
        }
      }
    };

    if (prevIds !== ids) {
      setLoading(true);
      setError(null);
      fetchPastTransactions();
    }
  }, [
    authKey,
    endpoint,
    ids,
    categories,
    getAllTransactions,
    selectedIdType,
    prevIds,
    isMounted,
    features?.apiVersion,
  ]);

  return {
    pastTransactionsResult,
    loading,
    error,
  };
};
