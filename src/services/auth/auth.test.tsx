import { authenticate } from "./index";
import { STAGING_ENDPOINT } from "../../config";
import { AppMode } from "../../common/hooks/useConfig";

const anyGlobal: any = global;
const mockFetch = jest.fn();
anyGlobal.fetch = mockFetch;

const mockAuthRes = {
  policy: [
    {
      category: "product-1",
      name: "Product 1",
      unit: "piece",
      quantityPerPeriod: 1,
      period: 604800
    },
    {
      category: "product-2",
      name: "Product 2",
      unit: "ml",
      quantityPerPeriod: 500,
      period: 604800
    }
  ],
  barcode: [
    {
      sku: "6001106119225",
      category: "product-x",
      unit: "ml",
      quantity: 200,
      name: "Dettol Hand Sanitiser 200ml"
    },
    {
      sku: "608912992255",
      category: "product-y",
      unit: "piece",
      quantity: 50,
      name: "Filter Mask - 50 Count 3-Ply Disposable Face Mask"
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
