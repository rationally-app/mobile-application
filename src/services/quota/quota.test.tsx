import { getQuota } from "./index";

describe("getQuota", () => {
  it("should return the quota of a nric number", async () => {
    const quota = await getQuota("S8174504H", "test-key");
    expect(quota).toEqual({
      remainingQuota: 7,
      history: [
        {
          quantity: 5,
          transactionTime: 1580330434981
        }
      ]
    });
  });
});
