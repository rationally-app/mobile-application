import { getDailyStatistics, StatisticsError } from "./index";
import { Sentry } from "../../utils/errorTracking";
import { DailyStatisticsResult } from "../../types";

jest.mock("../../utils/errorTracking");
const mockCaptureException = jest.fn();
(Sentry.captureException as jest.Mock).mockImplementation(mockCaptureException);

const mockFetch = jest.fn();
jest.spyOn(global, "fetch").mockImplementation(mockFetch);

describe("statistics", () => {
  let key: string;
  let endpoint: string;
  let mockDailyStatsResult: DailyStatisticsResult;
  let mockDailyStatsResponse: any;
  let timestamp: Date;

  beforeEach(() => {
    mockFetch.mockReset();
    mockCaptureException.mockReset();
  });

  describe("getDailyStatistics", () => {
    beforeAll(() => {
      key = "KEY";
      endpoint = "https://myendpoint.com";

      const dailyStatsResult = [
        {
          category: "toilet-paper",
          quantity: 100,
          transactionTime: 120000000000,
        },
        {
          category: "instant-noodles",
          quantity: 1,
          transactionTime: 120000000000,
        },
        {
          category: "chocolate",
          quantity: 30,
          transactionTime: 120000000000,
        },
        {
          category: "vouchers",
          quantity: 1,
          transactionTime: 120000000000,
        },
      ];

      timestamp = new Date(2020, 3, 1);

      mockDailyStatsResult = {
        pastTransactions: dailyStatsResult.map((t) => ({
          ...t,
          transactionTime: new Date(120000000000),
        })),
      };

      mockDailyStatsResponse = {
        pastTransactions: dailyStatsResult.map((t) => ({
          ...t,
          transactionTime: 120000000000,
        })),
      };
    });

    it("should return past transactions based on operatorToken", async () => {
      expect.assertions(1);
      mockFetch.mockReturnValueOnce({
        ok: true,
        json: () => Promise.resolve(mockDailyStatsResponse),
      });
      const dailyStatsResult = await getDailyStatistics(
        Date.now(),
        key,
        endpoint,
        ["operatorToken"]
      );
      expect(dailyStatsResult).toEqual(mockDailyStatsResult);
    });

    it("should throw error if no operatorToken was provided", async () => {
      expect.assertions(1);
      mockFetch.mockReturnValueOnce({
        ok: false,
        json: () =>
          Promise.resolve({ message: "No operatorToken was provided" }),
      });

      await expect(
        getDailyStatistics(timestamp.getTime(), key, endpoint, [""])
      ).rejects.toThrow(StatisticsError);
    });
  });
});
