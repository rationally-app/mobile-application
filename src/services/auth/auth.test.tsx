import { authenticate } from "./index";

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
    await authenticate("CORRECT_KEY", "https://myendpoint.com");
    expect(mockFetch.mock.calls[0]).toEqual([
      `https://myendpoint.com/auth`,
      { method: "GET", headers: { Authorization: "CORRECT_KEY" } }
    ]);
  });

  it("should return false when the fetch fail", async () => {
    expect.assertions(1);
    mockFetch.mockRejectedValueOnce(new Error("Boom"));
    await expect(
      authenticate("INCORRECT_TOKEN", "https://myendpoint.com")
    ).rejects.toThrow("Boom");
  });
});
