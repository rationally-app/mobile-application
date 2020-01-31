import { getQuota, postTransaction } from "./index";
import { ENDPOINT } from "../../config";

const anyGlobal: any = global;
const mockFetch = jest.fn();
anyGlobal.fetch = mockFetch;

describe("getQuota", () => {
  it("should return the quota of a nric number", async () => {
    expect.assertions(2);
    mockFetch.mockReturnValueOnce({
      then: () => ({
        remainingQuota: 5,
        history: []
      })
    });
    const quota = await getQuota("S000000J", "KEY");
    expect(mockFetch.mock.calls[0]).toEqual([
      `${ENDPOINT}/quota/S000000J`,
      { method: "GET", headers: { Authorization: "KEY" } }
    ]);
    expect(quota).toEqual({
      remainingQuota: 5,
      history: []
    });
  });
});

describe("postTransaction", () => {
  it("should create a new transaction", async () => {
    expect.assertions(2);
    mockFetch.mockReturnValueOnce({
      then: () => [
        {
          quantity: 5,
          transactionTime: 1580330642589
        }
      ]
    });
    const history = await postTransaction("S000000J", 1, "KEY");
    expect(mockFetch.mock.calls[0]).toEqual([
      `${ENDPOINT}/quota/S000000J`,
      { method: "GET", headers: { Authorization: "KEY" } }
    ]);
    expect(history).toEqual([
      {
        quantity: 5,
        transactionTime: 1580330642589
      }
    ]);
  });
});
