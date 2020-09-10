import { getDailyStatistics, StatisticsError } from "./index";
import { Sentry } from "../../utils/errorTracking";

jest.mock("../../utils/errorTracking");
const mockCaptureException = jest.fn();
(Sentry.captureException as jest.Mock).mockImplementation(mockCaptureException);

const mockFetch = jest.fn();
jest.spyOn(global, "fetch").mockImplementation(mockFetch);

const key = "KEY";
const endpoint = "https://myendpoint.com";

const dailyStatsResult = [
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
// const dailyStatsResult = [
//   {
//     category: "product-1",
//     quantity: 1,
//     identifierInputs: [
//       {
//         label: "first",
//         scanButtonType: "QR",
//         validationRegex: "^[A-F0-9]{9}$",
//         value: "123456789",
//         textInputType: "STRING"
//       }
//     ]
//   },
//   {
//     category: "product-1",
//     quantity: 1,
//     identifierInputs: [
//       {
//         label: "first",
//         scanButtonType: "QR",
//         validationRegex: "^[A-F0-9]{9}$",
//         value: "123456789",
//         textInputType: "STRING"
//       }
//     ]
//   },
//   {
//     category: "product-2",
//     quantity: 1,
//     identifierInputs: [
//       {
//         label: "first",
//         scanButtonType: "QR",
//         validationRegex: "^[A-F0-9]{9}$",
//         value: "123456789",
//         textInputType: "STRING"
//       }
//     ]
//   }
// ];

const timestamp = new Date(2020, 3, 1);

// const mockDailyStatsResult = {
//   transactions: [
//     {
//       transaction: transactions,
//       timestamp
//     }
//   ]
// };

const mockDailyStatsResult = {
  pastTransactions: dailyStatsResult.map(t => ({
    ...t,
    transactionTime: timestamp.getTime()
  }))
};

const mockDailyStatsResponse = {
  pastTransactions: dailyStatsResult.map(t => ({
    ...t,
    transactionTime: timestamp.getTime()
  }))
};

describe("statistics", () => {
  beforeEach(() => {
    mockFetch.mockReset();
    mockCaptureException.mockReset();
  });

  describe("getDailyStatistics", () => {
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
