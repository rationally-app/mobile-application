import { authenticate } from "./index";
import { STAGING_ENDPOINT } from "../../config";
import { AppMode } from "../../common/hooks/useConfig";

const anyGlobal: any = global;
const mockFetch = jest.fn();
anyGlobal.fetch = mockFetch;

const mockAuthRes = {
  policies: [
    {
      category: "toilet-paper",
      name: "Toilet Paper",
      period: 7,
      quantityLimit: 1000,
      unit: "piece"
    },
    {
      category: "instant-noodles",
      name: "Instant Noodles",
      period: 30,
      quantityLimit: 60,
      unit: "packs"
    },
    {
      category: "chocolate",
      name: "Chocolate",
      period: 14,
      quantityLimit: 1,
      unit: "grams"
    }
  ]
};

describe("authenticate", () => {
  it("should check the validity of the key", async () => {
    expect.assertions(1);
    mockFetch.mockResolvedValueOnce({
      status: 200,
      json: () => mockAuthRes
    });
    await authenticate("CORRECT_KEY", AppMode.staging);
    expect(mockFetch.mock.calls[0]).toEqual([
      `${STAGING_ENDPOINT}/auth`,
      { method: "GET", headers: { Authorization: "CORRECT_KEY" } }
    ]);
  });

  it("should return false when the fetch fail", async () => {
    expect.assertions(1);
    mockFetch.mockRejectedValueOnce(new Error("Boom"));
    await expect(
      authenticate("INCORRECT_TOKEN", AppMode.staging)
    ).rejects.toThrow("Boom");
  });
});
