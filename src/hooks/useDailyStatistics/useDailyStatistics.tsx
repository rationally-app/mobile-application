import { useState, useContext, useEffect } from "react";
import { usePrevious } from "../usePrevious";
import { CampaignConfigContext } from "../../context/campaignConfig";
import { getDailyStatistics } from "../../services/statistics";
import { countTotalTransactionsAndByCategory } from "./utils";
import { sortTransactionsByOrder } from "../../components/CustomerQuota/utils";

export type StatisticsHook = {
  totalCount: number | null;
  lastTransactionTime: Date | null;
  transactionHistory: {
    name: string;
    category: string;
    quantity: number;
    unit: { type: "PREFIX" | "POSTFIX"; label: string };
    descriptionAlert?: string;
  }[];
  error?: Error;
  loading: boolean;
};

export const useDailyStatistics = (
  sessionToken: string,
  endpoint: string,
  operatorToken: string,
  currentTimestamp: number
): StatisticsHook => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error>();
  const [totalCount, setTotalCount] = useState<StatisticsHook["totalCount"]>(
    null
  );
  const [lastTransactionTime, setLastTransactionTime] = useState<
    StatisticsHook["lastTransactionTime"]
  >(null);
  const [transactionHistory, setTransactionHistory] = useState<
    StatisticsHook["transactionHistory"]
  >([]);

  const { policies } = useContext(CampaignConfigContext);
  const prevTimestamp = usePrevious(currentTimestamp);

  useEffect(() => {
    const fetchDailyStatistics = async (): Promise<void> => {
      try {
        setLoading(true);
        const response = await getDailyStatistics(
          currentTimestamp,
          sessionToken,
          endpoint,
          [operatorToken]
        );
        const {
          summarisedTransactionHistory,
          summarisedTotalCount,
        } = countTotalTransactionsAndByCategory(
          response.pastTransactions,
          policies
        );
        setTransactionHistory(
          summarisedTransactionHistory.sort(sortTransactionsByOrder)
        );
        setTotalCount(summarisedTotalCount);

        if (summarisedTransactionHistory.length !== 0) {
          setLastTransactionTime(response.pastTransactions[0].transactionTime);
        } else {
          setLastTransactionTime(null);
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (prevTimestamp !== currentTimestamp) {
      fetchDailyStatistics();
    }
  }, [
    endpoint,
    operatorToken,
    policies,
    sessionToken,
    currentTimestamp,
    prevTimestamp,
  ]);

  return {
    totalCount,
    lastTransactionTime,
    transactionHistory,
    error,
    loading,
  };
};
