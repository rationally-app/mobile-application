import { IS_MOCK } from "../../config";
import { DailyStatisticsResult } from "../../types";
import { fetchWithValidator, ValidationError, SessionError } from "../helpers";
import { Sentry } from "../../utils/errorTracking";
import { subDays, addDays, getTime, isSameDay } from "date-fns";

export class StatisticsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StatisticsError";
  }
}

export const getDailyTransactionTimestampRange = (
  currentTimestamp: number
): { startTransactionTime: number; endTransactionTime: number } => {
  const startTransactionTime = new Date(currentTimestamp).setHours(0, 0, 0, 0);
  const endTransactionTime = new Date(currentTimestamp).setHours(
    23,
    59,
    59,
    999
  );
  return { startTransactionTime, endTransactionTime };
};

export const mockGetStatistics = async (
  _currentTimestamp: number,
  _token: string,
  _endpoint: string,
  _operatorTokens: string[]
): Promise<DailyStatisticsResult> => {
  const theDayBeforeYest = getTime(subDays(Date.now(), 2));
  const yesterday = getTime(subDays(Date.now(), 1));
  const today = Date.now();
  const tomorrow = getTime(addDays(Date.now(), 1));

  if (isSameDay(_currentTimestamp, today)) {
    return {
      pastTransactions: [
        {
          category: "toilet-paper",
          quantity: 100,
          transactionTime: new Date(today),
        },
        {
          category: "instant-noodles",
          quantity: 1,
          transactionTime: new Date(today),
        },
        {
          category: "chocolate",
          quantity: 30,
          transactionTime: new Date(today),
        },
        {
          category: "vouchers",
          quantity: 1,
          transactionTime: new Date(today),
        },
        {
          category: "vouchers",
          quantity: 1,
          transactionTime: new Date(today),
        },
      ],
    };
  } else if (isSameDay(_currentTimestamp, yesterday)) {
    return {
      pastTransactions: [
        {
          category: "instant-noodles",
          quantity: 999,
          transactionTime: new Date(yesterday),
        },
        {
          category: "chocolate",
          quantity: 3000,
          transactionTime: new Date(yesterday),
        },
        {
          category: "vouchers",
          quantity: 20,
          transactionTime: new Date(yesterday),
        },
      ],
    };
  } else if (isSameDay(_currentTimestamp, theDayBeforeYest)) {
    return {
      pastTransactions: [
        {
          category: "store",
          quantity: 1,
          transactionTime: new Date(theDayBeforeYest),
        },
        {
          category: "store",
          quantity: 5,
          transactionTime: new Date(theDayBeforeYest),
        },
      ],
    };
  } else if (isSameDay(_currentTimestamp, tomorrow)) {
    return {
      pastTransactions: [
        {
          category: "vouchers",
          quantity: 9999999,
          transactionTime: new Date(tomorrow),
        },
      ],
    };
  } else {
    return {
      pastTransactions: [],
    };
  }
};

export const liveGetStatistics = async (
  currentTimestamp: number,
  key: string,
  endpoint: string,
  operatorTokens: string[]
): Promise<DailyStatisticsResult> => {
  const { startTransactionTime, endTransactionTime } =
    getDailyTransactionTimestampRange(currentTimestamp);

  try {
    return await fetchWithValidator(
      DailyStatisticsResult,
      `${endpoint}/statistics/staff`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: key,
        },
        body: JSON.stringify({
          operatorTokens,
          startTransactionTime,
          endTransactionTime,
        }),
      }
    );
  } catch (e) {
    if (e instanceof ValidationError) {
      Sentry.captureException(e);
    } else if (e instanceof SessionError) {
      throw e;
    }

    throw new StatisticsError(e.message);
  }
};

export const getDailyStatistics = IS_MOCK
  ? mockGetStatistics
  : liveGetStatistics;
