import { getQuota, postTransaction } from "./index";

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
      const quota = await getQuota("S000000J", "KEY", "https://myendpoint.com");
      expect(mockFetch.mock.calls[0]).toEqual([
        `https://myendpoint.com/quota/S000000J`,
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
        transactions: [{ category: "abc123", quantity: 2 }],
        endpoint: "https://myendpoint.com"
      });
      expect(mockFetch.mock.calls[0]).toEqual([
        `https://myendpoint.com/transactions/S000000J`,
        {
          method: "POST",
          headers: { Authorization: "KEY" },
          body: JSON.stringify([{ category: "abc123", quantity: 2 }])
        }
      ]);
      expect(history).toEqual(mockPostTransactionResponse);
    });
  });
});
