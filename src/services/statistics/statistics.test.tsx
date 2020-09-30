import { getDailyStatistics, StatisticsError } from "./index";
import { Sentry } from "../../utils/errorTracking";
import { DailyStatistics } from "../../types";

jest.mock("../../utils/errorTracking");
const mockCaptureException = jest.fn();
(Sentry.captureException as jest.Mock).mockImplementation(mockCaptureException);

const mockFetch = jest.fn();
jest.spyOn(global, "fetch").mockImplementation(mockFetch);

describe("statistics", () => {
  let key: string;
  let endpoint: string;
  let dailyStatsResult;
  let mockDailyStatsResult: DailyStatistics;
  let mockDailyStatsResponse: DailyStatistics;
  let timestamp: Date;

  beforeEach(() => {
    mockFetch.mockReset();
    mockCaptureException.mockReset();
  });

  describe("getDailyStatistics", () => {
    beforeAll(() => {
      key = "KEY";
      endpoint = "https://myendpoint.com";

      dailyStatsResult = [
        {
          category: "toilet-paper",
          quantity: 100,
          transactionTime: Date.now()
        },
        {
          category: "instant-noodles",
          quantity: 1,
          transactionTime: Date.now()
        },
        {
          category: "chocolate",
          quantity: 30,
          transactionTime: Date.now()
        },
        {
          category: "vouchers",
          quantity: 1,
          transactionTime: Date.now()
        },
        {
          category: "vouchers",
          quantity: 1,
          transactionTime: Date.now()
        }
      ];

      timestamp = new Date(2020, 3, 1);

      mockDailyStatsResult = {
        pastTransactions: dailyStatsResult.map(t => ({
          ...t,
          transactionTime: timestamp.getTime()
        }))
      };

      mockDailyStatsResponse = {
        pastTransactions: dailyStatsResult.map(t => ({
          ...t,
          transactionTime: timestamp.getTime()
        }))
      };
    });
    it("should return past transactions based on operatorToken", async () => {
      expect.assertions(1);
      mockFetch.mockReturnValueOnce({
        ok: true,
        json: () => Promise.resolve(mockDailyStatsResponse)
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
          Promise.resolve({ message: "No operatorToken was provided" })
      });

      await expect(
        getDailyStatistics(timestamp.getTime(), key, endpoint, [""])
      ).rejects.toThrow(StatisticsError);
    });
  });
});
