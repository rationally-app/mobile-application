import {
  getVoucherValidation,
  postTransaction,
  InvalidVoucherError,
  PostTransactionError
} from "./index";
import * as Sentry from "sentry-expo";

jest.mock("sentry-expo");
const mockCaptureException = jest.fn();
(Sentry.captureException as jest.Mock).mockImplementation(mockCaptureException);

const anyGlobal: any = global;
const mockFetch = jest.fn();
anyGlobal.fetch = mockFetch;

const key = "KEY";
const endpoint = "https://myendpoint.com";

const transactions = [
  {
    category: "voucher",
    quantity: 2,
    identifiers: [
      {
        label: "Merchant Code",
        value: "CDC-0001"
      },
      {
        label: "Redeemed by",
        value: "Vendor"
      }
    ]
  }
];
const timestamp = new Date(2020, 3, 1);

const mockGetVoucherValidationResponse = {
  serial: "123456789",
  denomination: 2
};

const mockGetVoucherValidationResult = {
  serial: "123456789",
  denomination: 2
};

const postTransactionParams = {
  ids: ["123456789", "123456780"],
  transactions: transactions,
  key,
  endpoint
};

const mockPostTransactionResponse = {
  transactions: [
    {
      transaction: transactions,
      timestamp: timestamp.getTime()
    }
  ]
};

const mockPostTransactionResult = {
  transactions: [
    {
      transaction: transactions,
      timestamp
    }
  ]
};

describe("voucher", () => {
  beforeEach(() => {
    mockFetch.mockReset();
    mockCaptureException.mockReset();
  });

  describe("getVoucherValidation", () => {
    it("should return validity for voucher code", async () => {
      expect.assertions(1);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockGetVoucherValidationResponse)
      });
      const voucher = await getVoucherValidation("123456789", key, endpoint);
      expect(voucher).toEqual(mockGetVoucherValidationResult);
    });

    it("should throw error if invalid voucher code", async () => {
      expect.assertions(1);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(new InvalidVoucherError("Already redeemed"))
      });

      await expect(
        getVoucherValidation("000000000", key, endpoint)
      ).rejects.toThrow(InvalidVoucherError);
    });

    it("should capture exception through sentry if voucher is malformed", async () => {
      expect.assertions(2);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockGetVoucherValidationResponse.serial)
      });
      await expect(
        getVoucherValidation("123456789", key, endpoint)
      ).rejects.toThrow(InvalidVoucherError);
      expect(mockCaptureException).toHaveBeenCalledTimes(1);
    });

    it("should throw error if there were issues fetching", async () => {
      expect.assertions(1);
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      await expect(
        getVoucherValidation("000000000", key, endpoint)
      ).rejects.toThrow("Network error");
    });
  });

  describe("postTransaction", () => {
    it("should return the correct success result", async () => {
      expect.assertions(1);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPostTransactionResponse)
      });
      const result = await postTransaction(postTransactionParams);
      expect(result).toEqual(mockPostTransactionResult);
    });

    it("should throw error if no Voucher Code was provided", async () => {
      expect.assertions(1);
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ message: "No Voucher Code was provided" })
      });

      await expect(
        postTransaction({ ...postTransactionParams, ids: [] })
      ).rejects.toThrow(PostTransactionError);
    });

    it("should throw error if result is malformed", async () => {
      expect.assertions(1);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            t: mockPostTransactionResult.transactions
          })
      });

      await expect(postTransaction(postTransactionParams)).rejects.toThrow(
        PostTransactionError
      );
    });

    it("should capture exception through sentry if result is malformed", async () => {
      expect.assertions(2);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            t: mockPostTransactionResult.transactions
          })
      });

      await expect(postTransaction(postTransactionParams)).rejects.toThrow(
        PostTransactionError
      );
      expect(mockCaptureException).toHaveBeenCalledTimes(1);
    });

    it("should throw error if voucher could not be retrieved", async () => {
      expect.assertions(1);
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ message: "Invalid voucher codes" })
      });

      await expect(
        postTransaction({ ...postTransactionParams, ids: ["invalid-code"] })
      ).rejects.toThrow(PostTransactionError);
    });

    it("should throw error if there were issues fetching", async () => {
      expect.assertions(1);
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      await expect(postTransaction(postTransactionParams)).rejects.toThrow(
        "Network error"
      );
    });
  });
});
