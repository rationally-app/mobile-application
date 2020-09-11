import React, { createContext, FunctionComponent, useState } from "react";

export const FEATURES_KEY = "FEATURES";

interface StatisticsContext {
  totalCount: number | null;
  currentTimestamp: number;
  lastTransactionTime: number | null;
  transactionHistory: { name: string; category: string; quantity: number }[];
  setTotalCount: (totalCount: number) => void;
  setCurrentTimestamp: (currentTimestamp: number) => void;
  setLastTransactionTime: (lastTransactionTime: number) => void;
  setTransactionHistory: (
    transactionHistory: { name: string; category: string; quantity: number }[]
  ) => void;
}
export const StatisticsContext = createContext<StatisticsContext>({
  totalCount: null,
  currentTimestamp: Date.now(),
  lastTransactionTime: null,
  transactionHistory: [],
  setTotalCount: () => null,
  setCurrentTimestamp: () => null,
  setLastTransactionTime: () => null,
  setTransactionHistory: () => null
});

export const StatisticsContextProvider: FunctionComponent = ({ children }) => {
  const [totalCount, setTotalCount] = useState<StatisticsContext["totalCount"]>(
    null
  );
  const [currentTimestamp, setCurrentTimestamp] = useState<
    StatisticsContext["currentTimestamp"]
  >(Date.now());
  const [lastTransactionTime, setLastTransactionTime] = useState<
    StatisticsContext["lastTransactionTime"]
  >(null);
  const [transactionHistory, setTransactionHistory] = useState<
    StatisticsContext["transactionHistory"]
  >([]);

  return (
    <StatisticsContext.Provider
      value={{
        totalCount,
        currentTimestamp,
        lastTransactionTime,
        transactionHistory,
        setTotalCount,
        setCurrentTimestamp,
        setLastTransactionTime,
        setTransactionHistory
      }}
    >
      {children}
    </StatisticsContext.Provider>
  );
};
