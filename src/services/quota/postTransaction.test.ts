import {
  postTransaction,
  PostTransactionError,
  PostTransaction,
} from "./index";
import { Sentry } from "../../utils/errorTracking";
import { defaultSelectedIdType } from "../../context/identification";
import { PostTransactionResult } from "../../types";

jest.mock("../../utils/errorTracking");
const mockCaptureException = jest.fn();
(Sentry.captureException as jest.Mock).mockImplementation(mockCaptureException);

const mockFetch = jest.fn();
jest.spyOn(global, "fetch").mockImplementation(mockFetch);

const timestamp = new Date(2020, 3, 1);
const identificationFlag = defaultSelectedIdType;
const key = "KEY";
const endpoint = "https://myendpoint.com";

describe("postTransaction", () => {
  let transactionsToCheckout;
  let postTransactionParams: PostTransaction;

  let mockPostTransactionApiResponse: {
    transactions: {
      transaction: {
        category: string;
        quantity: number;
        identifierInputs: never[];
      }[];
      timestamp: number;
    }[];
  };
  let mockPostTransactionResult: PostTransactionResult;

  beforeEach(() => {
    mockFetch.mockReset();
    mockCaptureException.mockReset();

    transactionsToCheckout = [
      { category: "product-1", quantity: 1, identifierInputs: [] },
    ];

    postTransactionParams = {
      ids: ["S0000000J"],
      identificationFlag,
      transactions: transactionsToCheckout,
      key,
      endpoint,
    };

    mockPostTransactionApiResponse = {
      transactions: [
        {
          transaction: transactionsToCheckout,
          timestamp: timestamp.getTime(),
        },
      ],
    };

    mockPostTransactionResult = {
      transactions: [
        {
          transaction: transactionsToCheckout,
          timestamp,
        },
      ],
    };
  });

  it("should return the correct success result", async () => {
    expect.assertions(1);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockPostTransactionApiResponse),
    });
    const result = await postTransaction(postTransactionParams);
    expect(result).toStrictEqual(mockPostTransactionResult);
  });

  it("should return the correct success result even with additional version param", async () => {
    expect.assertions(1);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockPostTransactionApiResponse),
    });
    const result = await postTransaction({
      ...postTransactionParams,
      apiVersion: "v2",
    });
    expect(result).toStrictEqual(mockPostTransactionResult);
  });

  it("should throw error if no ID was provided", async () => {
    expect.assertions(1);
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: "No ID was provided" }),
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
          t: mockPostTransactionResult.transactions,
        }),
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
          t: mockPostTransactionResult.transactions,
        }),
    });

    await expect(postTransaction(postTransactionParams)).rejects.toThrow(
      PostTransactionError
    );
    expect(mockCaptureException).toHaveBeenCalledTimes(1);
  });

  it("should throw error if quota could not be retrieved", async () => {
    expect.assertions(1);
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: "Invalid customer ID" }),
    });

    await expect(
      postTransaction({ ...postTransactionParams, ids: ["invalid-id"] })
    ).rejects.toThrow(PostTransactionError);
  });

  it("should throw error if there were issues with querying the endpoint", async () => {
    expect.assertions(1);
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    await expect(postTransaction(postTransactionParams)).rejects.toThrow(
      NetworkError
    );
  });

  it("should throw error if there was an issue with authentication", async () => {
    expect.assertions(1);
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () =>
        Promise.resolve({ message: "Invalid authentication token provided" }),
    });

    await expect(postTransaction(postTransactionParams)).rejects.toThrow(
      SessionError
    );
  });
});

    expect.assertions(1);
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    await expect(postTransaction(postTransactionParams)).rejects.toThrow(
      "Network error"
    );
  });
});
