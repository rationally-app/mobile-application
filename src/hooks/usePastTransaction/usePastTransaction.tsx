import { useEffect, useState } from "react";
import { PastTransactionsResult } from "../../types";
import { usePrevious } from "../usePrevious";
import { getPastTransactions } from "../../services/quota";

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
      try {
        const pastTransactionsResponse = await getPastTransactions(
          id,
          authKey,
          endpoint
        );
        setPastTransactionsResult(pastTransactionsResponse);
      } catch (e) {
        // if (e instanceof PastTransactionError)
        // Still figuring how to throw error
      }
    };

    if (prevId != id) fetchPastTransactions();
  }, [authKey, endpoint, id, prevId]);

  return {
    pastTransactionsResult
  };
};
