import { getQuota } from "./index";

describe("getQuota", () => {
  it("should return the quota of a nric number", async () => {
    expect.assertions(1);
    const quota = await getQuota("S8174504H", "test-key");
    expect(quota).toStrictEqual({
      remainingQuota: 1,
      history: [
        {
          quantity: 1,
          transactionTime: 1580330434981
        }
      ]
    });
  });
});
