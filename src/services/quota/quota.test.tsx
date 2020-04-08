import {
  getQuota,
  postTransaction,
  PostTransaction,
  Quota,
  PostTransactionResponse
} from "./index";

const anyGlobal: any = global;
const mockFetch = jest.fn();
anyGlobal.fetch = mockFetch;

const transactions: PostTransaction["transactions"] = [
  {
    category: "product-1",
    quantity: 1
  },
  {
    category: "product-2",
    quantity: 0
  }
];
const timestamp = new Date(2020, 3, 1).getTime();

const mockGetQuotaResponse: Quota = {
  remainingQuota: transactions.map(t => ({ ...t, transactionTime: timestamp }))
};

const mockPostTransactionResponse: PostTransactionResponse = {
  transactions: [
    {
      transaction: transactions,
      timestamp
    }
  ]
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
      const quota = await getQuota(
        ["S0000000J"],
        "KEY",
        "https://myendpoint.com"
      );
      expect(mockFetch.mock.calls[0]).toEqual([
        `https://myendpoint.com/quota`,
        {
          method: "POST",
          headers: { Authorization: "KEY" },
          body: JSON.stringify({ ids: ["S0000000J"] })
        }
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
        nrics: ["S0000000J"],
        key: "KEY",
        transactions: [{ category: "abc123", quantity: 2 }],
        endpoint: "https://myendpoint.com"
      });
      expect(mockFetch.mock.calls[0]).toEqual([
        `https://myendpoint.com/transactions`,
        {
          method: "POST",
          headers: { Authorization: "KEY" },
          body: JSON.stringify({
            ids: ["S0000000J"],
            transaction: [{ category: "abc123", quantity: 2 }]
          })
        }
      ]);
      expect(history).toEqual(mockPostTransactionResponse);
    });
  });
});
