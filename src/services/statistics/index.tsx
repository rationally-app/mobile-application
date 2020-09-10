import { IS_MOCK } from "../../config";
import { DailyStatistics } from "../../types";
import { fetchWithValidator, ValidationError } from "../helpers";
import { Sentry } from "../../utils/errorTracking";

export class StatisticsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StatisticsError";
  }
}

export const getDailyTransactionTimestampRange = (
  currentTimestamp: number
): { startTimestamp: number; endTimestamp: number } => {
  const startTimestamp = new Date(currentTimestamp).setHours(0, 0, 0, 0);
  const endTimestamp = new Date(currentTimestamp).setHours(23, 59, 59, 999);
  return { startTimestamp, endTimestamp };
};

export const mockGetStatistics = async (
  _currentTimestamp: number,
  _token: string,
  _endpoint: string,
  _operatorTokens: string[]
): Promise<DailyStatistics> => {
  const transactionTime = Date.now();

  return {
    pastTransactions: [
      {
        category: "toilet-paper",
        quantity: 100,
        transactionTime
      },
      {
        category: "instant-noodles",
        quantity: 1,
        transactionTime
      },
      {
        category: "chocolate",
        quantity: 30,
        transactionTime
      },
      {
        category: "vouchers",
        quantity: 1,
        transactionTime
      },
      {
        category: "vouchers",
        quantity: 1,
        transactionTime
      }
    ]
  };
};

export const liveGetStatistics = async (
  currentTimestamp: number,
  key: string,
  endpoint: string,
  operatorTokens: string[]
): Promise<DailyStatistics> => {
  let response;
  const { startTimestamp, endTimestamp } = getDailyTransactionTimestampRange(
    currentTimestamp
  );

  try {
    response = await fetchWithValidator(
      DailyStatistics,
      `${endpoint}/transactions/staff`,
      {
        method: "POST",
        headers: {
          Authorization: key
        },
        body: JSON.stringify({
          operatorTokens,
          startTimestamp,
          endTimestamp
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
