import { IS_MOCK } from "../../config";
import { DailyStatistics } from "../../types";
import { fetchWithValidator, ValidationError } from "../helpers";
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
): Promise<DailyStatistics> => {
  const yesterday = getTime(subDays(Date.now(), 1));
  const today = Date.now();
  const tomorrow = getTime(addDays(Date.now(), 1));

  if (isSameDay(_currentTimestamp, today)) {
    return {
      pastTransactions: [
        {
          category: "toilet-paper",
          quantity: 100,
          transactionTime: today
        },
        {
          category: "instant-noodles",
          quantity: 1,
          transactionTime: today
        },
        {
          category: "chocolate",
          quantity: 30,
          transactionTime: today
        },
        {
          category: "vouchers",
          quantity: 1,
          transactionTime: today
        },
        {
          category: "vouchers",
          quantity: 1,
          transactionTime: today
        }
      ]
    };
  } else if (isSameDay(_currentTimestamp, yesterday)) {
    return {
      pastTransactions: [
        {
          category: "instant-noodles",
          quantity: 999,
          transactionTime: yesterday
        },
        {
          category: "chocolate",
          quantity: 3000,
          transactionTime: yesterday
        },
        {
          category: "vouchers",
          quantity: 20,
          transactionTime: yesterday
        }
      ]
    };
  } else if (isSameDay(_currentTimestamp, tomorrow)) {
    return {
      pastTransactions: [
        {
          category: "vouchers",
          quantity: 9999999,
          transactionTime: tomorrow
        }
      ]
    };
  } else {
    return {
      pastTransactions: []
    };
  }
};

export const liveGetStatistics = async (
  currentTimestamp: number,
  key: string,
  endpoint: string,
  operatorTokens: string[]
): Promise<DailyStatistics> => {
  let response;
  const {
    startTransactionTime,
    endTransactionTime
  } = getDailyTransactionTimestampRange(currentTimestamp);

  try {
    response = await fetchWithValidator(
      DailyStatistics,
      `${endpoint}/statistics/staff`,
      {
        method: "POST",
        headers: {
          Authorization: key
        },
        body: JSON.stringify({
          operatorTokens,
          startTransactionTime,
          endTransactionTime
        })
      }
    );
    return response;
  } catch (e) {
    if (e instanceof ValidationError) {
      Sentry.captureException(e);
    }

    throw new StatisticsError(e.message);
  }
};

export const getDailyStatistics = IS_MOCK
  ? mockGetStatistics
  : liveGetStatistics;
