import { useEffect, useState } from "react";
import { PastTransactionsResult } from "../../types";
import { usePrevious } from "../usePrevious";
import { getPastTransactions } from "../../services/quota";
import { Sentry } from "../../utils/errorTracking";

export type PastTransactionHook = {
  pastTransactionsResult: PastTransactionsResult | null;
};

export const usePastTransaction = (
  id: string,
  authKey: string,
  endpoint: string
): PastTransactionHook => {
  const [
    pastTransactionsResult,
    setPastTransactionsResult
  ] = useState<PastTransactionsResult | null>(null);
  const prevId = usePrevious(id);

  useEffect(() => {
    const fetchPastTransactions = async (): Promise<void> => {
      const pastTransactionsResponse = await getPastTransactions(
        id,
        authKey,
        endpoint
      );

      setPastTransactionsResult(pastTransactionsResponse);
    };

    if (prevId != id)
      fetchPastTransactions().catch(() => {
        Sentry.captureException(`Unable to fetch past transactions: ${id}`);
      });
  }, [authKey, endpoint, id, prevId]);

  return {
    pastTransactionsResult
  };
};
