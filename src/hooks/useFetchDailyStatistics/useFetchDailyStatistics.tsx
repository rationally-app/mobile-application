import { useState, useCallback, useContext } from "react";
import { AuthContext } from "../../context/auth";
import { CampaignConfigContext } from "../../context/campaignConfig";
import { getDailyStatistics } from "../../services/statistics";
import { countTotalTransactionsAndByCategory } from "../../components/DailyStatistics/utils";

export type StatisticsHook = {
  totalCount: number | null;
  currentTimestamp: number;
  lastTransactionTime: number | null;
  transactionHistory: {
    name: string;
    category: string;
    quantityText: string;
  }[];
  setTotalCount: (totalCount: number | null) => void;
  setCurrentTimestamp: (currentTimestamp: number) => void;
  setLastTransactionTime: (lastTransactionTime: number) => void;
  setTransactionHistory: (
    transactionHistory: {
      name: string;
      category: string;
      quantityText: string;
    }[]
  ) => void;
  clearStatistics: () => void;
  fetchDailyStatistics: (currentTimestamp: number) => void;
  error?: Error;
  clearError: () => void;
};

export const useFetchDailyStatistics = (timestamp?: number): StatisticsHook => {
  const { sessionToken, endpoint, operatorToken } = useContext(AuthContext);
  const { policies } = useContext(CampaignConfigContext);
  const [totalCount, setTotalCount] = useState<StatisticsHook["totalCount"]>(
    null
  );
  const [currentTimestamp, setCurrentTimestamp] = useState<
    StatisticsHook["currentTimestamp"]
  >(Date.now());
  const [lastTransactionTime, setLastTransactionTime] = useState<
    StatisticsHook["lastTransactionTime"]
  >(null);
  const [transactionHistory, setTransactionHistory] = useState<
    StatisticsHook["transactionHistory"]
  >([]);

  const [error, setError] = useState<Error>();
  const clearError = useCallback((): void => setError(undefined), []);

  const clearStatistics: StatisticsHook["clearStatistics"] = useCallback(() => {
    setTotalCount(null);
    setCurrentTimestamp(Date.now());
    setLastTransactionTime(null);
    setTransactionHistory([]);
  }, []);

  const fetchDailyStatistics: StatisticsHook["fetchDailyStatistics"] = useCallback(
    async (currentTimestamp: number): Promise<void> => {
      try {
        const response = await getDailyStatistics(
          currentTimestamp,
          sessionToken,
          endpoint,
          [operatorToken]
        );
        const {
          summarisedTransactionHistory,
          summarisedTotalCount
        } = countTotalTransactionsAndByCategory(response, policies);
        setTransactionHistory(summarisedTransactionHistory);
        setTotalCount(summarisedTotalCount);
        setCurrentTimestamp(currentTimestamp);

        if (response.pastTransactions.length !== 0) {
          setLastTransactionTime(response.pastTransactions[0].transactionTime);
        } else {
          setLastTransactionTime(0);
        }
      } catch (error) {
        setError(error);
      }
    },
    [
      endpoint,
      operatorToken,
      policies,
      sessionToken,
      setCurrentTimestamp,
      setLastTransactionTime,
      setTotalCount,
      setTransactionHistory
    ]
  );
  return {
    totalCount,
    currentTimestamp,
    lastTransactionTime,
    transactionHistory,
    setTotalCount,
    setCurrentTimestamp,
    setLastTransactionTime,
    setTransactionHistory,
    clearStatistics,
    fetchDailyStatistics,
    error,
    clearError
  };
};
