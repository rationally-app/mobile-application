import { getQuota, postTransaction } from "./index";
import { STAGING_ENDPOINT } from "../../config";
import { AppMode } from "../../common/hooks/useConfig";

const anyGlobal: any = global;
const mockFetch = jest.fn();
anyGlobal.fetch = mockFetch;

const mockGetQuotaResponse = [
  {
    category: "product-1",
    remainingQuota: 1
  },
  {
    category: "product-2",
    remainingQuota: 0
  }
];

const mockPostTransactionResponse = {
  transactions: mockGetQuotaResponse
};

describe("quota", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  describe("getQuota", () => {
    it("should return the quota of a nric number", async () => {
      expect.assertions(2);
      mockFetch.mockReturnValueOnce({
        then: () => mockGetQuotaResponse
      });
      const quota = await getQuota("S000000J", "KEY", AppMode.staging);
      expect(mockFetch.mock.calls[0]).toEqual([
        `${STAGING_ENDPOINT}/quota/S000000J`,
        { method: "GET", headers: { Authorization: "KEY" } }
      ]);
      expect(quota).toEqual(mockGetQuotaResponse);
    });
  });

  describe("postTransaction", () => {
    it("should create a new transaction", async () => {
      expect.assertions(2);
      mockFetch.mockReturnValueOnce({
        then: () => mockPostTransactionResponse
      });
      const history = await postTransaction({
        nric: "S000000J",
        key: "KEY",
        transactions: [{ sku: "abc123", quantity: 2 }],
        mode: AppMode.staging
      });
      expect(mockFetch.mock.calls[0]).toEqual([
        `${STAGING_ENDPOINT}/transactions/S000000J`,
        {
          method: "POST",
          headers: { Authorization: "KEY" },
          body: JSON.stringify([{ sku: "abc123", quantity: 2 }])
        }
      ]);
      expect(history).toEqual(mockPostTransactionResponse);
    });
  });
});
