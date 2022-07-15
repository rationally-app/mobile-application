import {
  getQuota,
  QuotaError,
  getPastTransactions,
  PastTransactionError,
} from "./index";
import { Sentry } from "../../utils/errorTracking";
import { defaultSelectedIdType } from "../../context/identification";

jest.mock("../../utils/errorTracking");
const mockCaptureException = jest.fn();
(Sentry.captureException as jest.Mock).mockImplementation(mockCaptureException);

const mockFetch = jest.fn();
jest.spyOn(global, "fetch").mockImplementation(mockFetch);

const identificationFlag = defaultSelectedIdType;
const key = "KEY";
const endpoint = "https://myendpoint.com";

const transactions = [
  {
    category: "product-1",
    quantity: 1,
    identifiers: [],
  },
  {
    category: "product-2",
    quantity: 0,
    identifiers: [],
  },
];

const pastTransactions = [
  {
    category: "product-1",
    quantity: 1,
    identifierInputs: [
      {
        label: "first",
        scanButtonType: "QR",
        validationRegex: "^[A-F0-9]{9}$",
        value: "123456789",
        textInputType: "STRING",
      },
    ],
  },
  {
    category: "product-1",
    quantity: 1,
    identifierInputs: [
      {
        label: "first",
        scanButtonType: "QR",
        validationRegex: "^[A-F0-9]{9}$",
        value: "123456789",
        textInputType: "STRING",
      },
    ],
  },
  {
    category: "product-2",
    quantity: 1,
    identifierInputs: [
      {
        label: "first",
        scanButtonType: "QR",
        validationRegex: "^[A-F0-9]{9}$",
        value: "123456789",
        textInputType: "STRING",
      },
    ],
  },
];

const pastTransactionsWithSameCategory = [
  {
    category: "product-2",
    quantity: 1,
    identifierInputs: [
      {
        label: "first",
        scanButtonType: "QR",
        validationRegex: "^[A-F0-9]{9}$",
        value: "123456789",
        textInputType: "STRING",
      },
    ],
  },
  {
    category: "product-2",
    quantity: 1,
    identifierInputs: [
      {
        label: "second",
        scanButtonType: "QR",
        validationRegex: "^[A-F0-9]{9}$",
        value: "123456789",
        textInputType: "STRING",
      },
    ],
  },
];

const timestamp = new Date(2020, 3, 1);

const mockGetQuotaResponseSingleId = {
  remainingQuota: transactions.map((t) => ({
    ...t,
    transactionTime: timestamp.getTime(),
  })),
  globalQuota: transactions.map((t) => ({
    ...t,
    transactionTime: timestamp.getTime(),
  })),
  localQuota: transactions.map((t) => ({
    ...t,
    quantity: Number.MAX_SAFE_INTEGER,
    transactionTime: timestamp.getTime(),
  })),
};

const mockGetQuotaResultSingleId = {
  remainingQuota: transactions.map((t) => ({
    ...t,
    transactionTime: timestamp,
  })),
  globalQuota: transactions.map((t) => ({
    ...t,
    transactionTime: timestamp,
  })),
  localQuota: transactions.map((t) => ({
    ...t,
    quantity: Number.MAX_SAFE_INTEGER,
    transactionTime: timestamp,
  })),
};

const mockGetQuotaResponseMultipleId = {
  remainingQuota: transactions,
  globalQuota: transactions,
  localQuota: transactions.map((t) => ({
    ...t,
    quantity: Number.MAX_SAFE_INTEGER,
  })),
};

const mockPastTransactionsResponse = {
  pastTransactions: pastTransactions.map((t) => ({
    ...t,
    transactionTime: timestamp.getTime(),
  })),
};

const mockPastTransactionsWithSameCategoryResponse = {
  pastTransactions: pastTransactionsWithSameCategory.map((t) => ({
    ...t,
    transactionTime: timestamp.getTime(),
  })),
};

const mockPastTransactionsResult = {
  pastTransactions: pastTransactions.map((t) => ({
    ...t,
    transactionTime: timestamp,
  })),
};

const mockPastTransactionsWithSameCategoryResult = {
  pastTransactions: pastTransactionsWithSameCategory.map((t) => ({
    ...t,
    transactionTime: timestamp,
  })),
};

describe("quota", () => {
  beforeEach(() => {
    mockFetch.mockReset();
    mockCaptureException.mockReset();
  });

  describe("getQuota", () => {
    it("should return the quota of an ID", async () => {
      expect.assertions(1);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockGetQuotaResponseSingleId),
      });
      const quota = await getQuota(
        ["S0000000J"],
        identificationFlag,
        key,
        endpoint
      );
      expect(quota).toEqual(mockGetQuotaResultSingleId);
    });

    it("should return the quota of an ID if version is passed in", async () => {
      expect.assertions(1);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockGetQuotaResponseSingleId),
      });
      const quota = await getQuota(
        ["S0000000J"],
        identificationFlag,
        key,
        endpoint,
        "v2" // version from features
      );
      expect(quota).toEqual(mockGetQuotaResultSingleId);
    });

    it("should return the combined quota of multiple IDs", async () => {
      expect.assertions(1);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockGetQuotaResponseMultipleId),
      });
      const quota = await getQuota(
        ["S0000000J", "S0000001I"],
        identificationFlag,
        key,
        endpoint
      );
      expect(quota).toEqual(mockGetQuotaResponseMultipleId);
    });

    it("should throw error if no ID was provided", async () => {
      expect.assertions(1);
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ message: "No ID was provided" }),
      });

      await expect(
        getQuota([], identificationFlag, key, endpoint)
      ).rejects.toThrow(QuotaError);
    });

    it("should throw error if quota is malformed", async () => {
      expect.assertions(1);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            remaining: mockGetQuotaResponseSingleId.remainingQuota,
          }),
      });

      await expect(
        getQuota(["S0000000J"], identificationFlag, key, endpoint)
      ).rejects.toThrow(QuotaError);
    });

    it("should capture exception through sentry if quota is malformed", async () => {
      expect.assertions(2);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            remaining: mockGetQuotaResponseSingleId.remainingQuota,
          }),
      });

      await expect(
        getQuota(["S0000000J"], identificationFlag, key, endpoint)
      ).rejects.toThrow(QuotaError);
      expect(mockCaptureException).toHaveBeenCalledTimes(1);
    });

    it("should throw error if quota could not be retrieved", async () => {
      expect.assertions(1);
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ message: "Invalid customer ID" }),
      });

      await expect(
        getQuota(["invalid-id"], identificationFlag, key, endpoint)
      ).rejects.toThrow(QuotaError);
    });

    it("should throw error if there were issues fetching", async () => {
      expect.assertions(1);
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      await expect(
        getQuota(["S0000000J"], identificationFlag, key, endpoint)
      ).rejects.toThrow("Network error");
    });
  });

  describe("getPastTransaction", () => {
    it("should return past transactions based on ID", async () => {
      expect.assertions(1);
      mockFetch.mockReturnValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPastTransactionsResponse),
      });
      const pastTransactionsResult = await getPastTransactions(
        ["S0000000J"],
        identificationFlag,
        key,
        endpoint
      );
      expect(pastTransactionsResult).toEqual(mockPastTransactionsResult);
    });

    it("should return past transactions with additional version param", async () => {
      expect.assertions(1);
      mockFetch.mockReturnValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPastTransactionsResponse),
      });
      const pastTransactionsResult = await getPastTransactions(
        ["S0000000J"],
        identificationFlag,
        key,
        endpoint,
        [],
        false,
        "v2"
      );
      expect(pastTransactionsResult).toEqual(mockPastTransactionsResult);
    });

    it("should throw error if no ID was provided", async () => {
      expect.assertions(1);
      mockFetch.mockReturnValueOnce({
        ok: false,
        json: () => Promise.resolve({ message: "No ID was provided" }),
      });

      await expect(
        getPastTransactions([""], identificationFlag, key, endpoint)
      ).rejects.toThrow(PastTransactionError);
    });

    it("should throw error if past transactions are malformed", async () => {
      expect.assertions(1);
      mockFetch.mockReturnValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            transactions: mockPastTransactionsResponse.pastTransactions,
          }),
      });

      await expect(
        getPastTransactions(["S0000000J"], identificationFlag, key, endpoint)
      ).rejects.toThrow(PastTransactionError);
    });

    it("should return past transactions based on ID, filtered by categories, if categories is specified", async () => {
      expect.assertions(2);

      mockFetch.mockReturnValueOnce({
        ok: true,
        json: () =>
          Promise.resolve(mockPastTransactionsWithSameCategoryResponse),
      });

      const categories = ["product-2"];
      const pastTransactionsResult = await getPastTransactions(
        ["S0000000J"],
        identificationFlag,
        key,
        endpoint,
        categories
      );

      expect(mockFetch).toHaveBeenCalledWith(
        `${endpoint}/transactions/history`,
        {
          body: JSON.stringify({
            ids: ["S0000000J"],
            identificationFlag,
            getAllTransactions: false,
            categories,
          }),
          headers: {
            Authorization: key,
            "Content-Type": "application/json",
          },
          method: "POST",
        }
      );
      expect(pastTransactionsResult).toEqual(
        mockPastTransactionsWithSameCategoryResult
      );
    });
  });
});
