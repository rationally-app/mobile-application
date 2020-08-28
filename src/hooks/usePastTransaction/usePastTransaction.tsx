import { useEffect, useState } from "react";
import { PastTransactionsResult } from "../../types";
import { usePrevious } from "../usePrevious";
import { getPastTransactions } from "../../services/quota";
import { Sentry } from "../../utils/errorTracking";

export type PastTransactionHook = {
  pastTransactionsResult: PastTransactionsResult | null;
};

export const usePastTransaction = (
  ids: string[],
  authKey: string,
  endpoint: string
): PastTransactionHook => {
  const [
    pastTransactionsResult,
    setPastTransactionsResult
  ] = useState<PastTransactionsResult | null>(null);
  const prevIds = usePrevious(ids);

  useEffect(() => {
    const fetchPastTransactions = async (): Promise<void> => {
      const pastTransactionsResponse = await getPastTransactions(
        ids,
        authKey,
        endpoint
      );

      setPastTransactionsResult(pastTransactionsResponse);
    };

    if (prevIds !== ids)
      fetchPastTransactions().catch(() => {
        Sentry.captureException(`Unable to fetch past transactions: ${ids}`);
      });
  }, [authKey, endpoint, ids, prevIds]);

  return {
    pastTransactionsResult
  };
};
