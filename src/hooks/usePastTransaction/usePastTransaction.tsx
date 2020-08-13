import { useEffect, useState } from "react";
import { PastTransactionsResult } from "../../types";
import { usePrevious } from "../usePrevious";
import { getPastTransactions } from "../../services/quota";

export type PastTransactionHook = {
  pastTransactions: PastTransactionsResult | null;
};

export const usePastTransaction = (
  id: string,
  authKey: string,
  endpoint: string
): PastTransactionHook => {
  const [
    pastTransactions,
    setPastTransactions
  ] = useState<PastTransactionsResult | null>(null);
  const prevId = usePrevious(id);

  useEffect(() => {
    const fetchPastTransactions = async (): Promise<void> => {
      console.warn("fetching...");
      try {
        const pastTransactionsResponse = await getPastTransactions(
          id,
          authKey,
          endpoint
        );
        setPastTransactions(pastTransactionsResponse);
      } catch (e) {
        // if (e instanceof PastTransactionError)
        // Still figuring how to throw error
      }
    };

    if (prevId != id) fetchPastTransactions();
  }, [authKey, endpoint, id, prevId]);

  return {
    pastTransactions
  };
};
