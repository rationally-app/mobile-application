import React, { FunctionComponent } from "react";
import { renderHook } from "@testing-library/react-hooks";
import { useDailyStatistics } from "./useDailyStatistics";
import { getDailyStatistics } from "../../services/statistics";
import { ProductContextProvider } from "../../context/products";
import { defaultIdentifier } from "../../test/helpers/defaults";
import { CampaignPolicy } from "../../types";
import { Sentry } from "../../utils/errorTracking";
import { wait } from "@testing-library/react-native";

jest.mock("../../utils/errorTracking");
const mockCaptureException = jest.fn();
(Sentry.captureException as jest.Mock).mockImplementation(mockCaptureException);

jest.mock("../../services/statistics");
const mockGetDailyStatistics = getDailyStatistics as jest.Mock;

const key = "KEY";
const endpoint = "https://myendpoint.com";
const operatorToken = "operator-token";

const wrapper: FunctionComponent = ({ children }) => (
  <ProductContextProvider products={customProducts}>
    {children}
  </ProductContextProvider>
);

const customProducts: CampaignPolicy[] = [
  {
    category: "specs",
    categoryType: "DEFAULT",
    name: "Specs",
    order: 1,
    identifiers: [
      {
        ...defaultIdentifier,
        label: "first",
      },
    ],
    quantity: {
      period: -1,
      periodType: "ROLLING",
      periodExpression: 365,
      limit: 1,
      default: 1,
    },
    type: "REDEEM",
  },
  {
    category: "specs-lost",
    categoryType: "APPEAL",
    name: "Lost Specs",
    order: 1,
    alert: {
      threshold: 2,
      label: "*chargeable",
    },
    quantity: {
      period: -1,
      periodType: "ROLLING",
      periodExpression: 365,
      limit: 9999,
      default: 1,
    },
    identifiers: [
      {
        ...defaultIdentifier,
        label: "first",
      },
    ],
    type: "REDEEM",
  },
];

describe("useDailyStatistics", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockGetDailyStatistics.mockReset();
  });

  it("should set error if error is thrown while getting daily stats", async () => {
    expect.assertions(1);

    mockGetDailyStatistics.mockRejectedValue(
      new Error("Error getting daily statistics")
    );

    const { result, waitForNextUpdate } = renderHook(
      () => useDailyStatistics(key, endpoint, operatorToken, Date.now()),
      { wrapper }
    );

    await waitForNextUpdate();

    expect(result.current.error?.message).toBe(
      "Error getting daily statistics"
    );
  });

  it("should set last transaction time, total count, transaction history after getting daily stats", async () => {
    expect.assertions(3);

    mockGetDailyStatistics.mockResolvedValue({
      pastTransactions: [
        {
          category: "vouchers",
          quantity: 9999999,
          transactionTime: new Date(12000000000),
        },
      ],
    });

    const { result, waitForNextUpdate } = renderHook(
      () => useDailyStatistics(key, endpoint, operatorToken, 12000000000),
      { wrapper }
    );

    await waitForNextUpdate();

    expect(result.current.lastTransactionTime).toStrictEqual(
      new Date(12000000000)
    );
    expect(result.current.totalCount).toBe(9999999);
    expect(result.current.transactionHistory).toStrictEqual([
      {
        category: "vouchers",
        name: "vouchers",
        quantityText: "9,999,999 qty",
        descriptionAlert: undefined,
        order: -1,
      },
    ]);
  });

  it("last transaction time should be set as null if transaction history is empty", async () => {
    expect.assertions(2);

    mockGetDailyStatistics.mockResolvedValue({
      pastTransactions: [],
    });

    const { result, waitForNextUpdate } = renderHook(
      () => useDailyStatistics(key, endpoint, operatorToken, 12000000000),
      { wrapper }
    );

    await waitForNextUpdate();

    expect(result.current.lastTransactionTime).toBeNull();
    expect(result.current.transactionHistory).toStrictEqual([]);
  });

  it("should not call fetchDailyStatistics again if timestamp remains the same, instead should be unable to render, and timeout", async () => {
    expect.assertions(4);

    mockGetDailyStatistics.mockResolvedValue({
      pastTransactions: [
        {
          category: "vouchers",
          quantity: 9999999,
          transactionTime: new Date(12000000000),
        },
      ],
    });
    const currentTimestamp = 12000000000;
    const { result, waitForNextUpdate, rerender } = renderHook(
      () => useDailyStatistics(key, endpoint, operatorToken, currentTimestamp),
      { wrapper }
    );

    await waitForNextUpdate();

    expect(result.current.lastTransactionTime).toStrictEqual(
      new Date(12000000000)
    );
    expect(result.current.totalCount).toBe(9999999);
    expect(result.current.transactionHistory).toStrictEqual([
      {
        category: "vouchers",
        name: "vouchers",
        quantityText: "9,999,999 qty",
        descriptionAlert: undefined,
        order: -1,
      },
    ]);

    rerender([key, endpoint, operatorToken, currentTimestamp]);

    await expect(waitForNextUpdate({ timeout: 100 })).rejects.toThrow("");
  });
  it("should call fetchDailyStatistics again if timestamp changes", async () => {
    expect.assertions(7);

    mockGetDailyStatistics.mockResolvedValueOnce({
      pastTransactions: [
        {
          category: "vouchers",
          quantity: 9999999,
          transactionTime: new Date(12000000000),
        },
      ],
    });

    let currentTimestamp = 12000000000;
    const { rerender, result } = renderHook(
      () => useDailyStatistics(key, endpoint, operatorToken, currentTimestamp),
      { wrapper }
    );

    await wait(() => {
      expect(result.current.lastTransactionTime).toStrictEqual(
        new Date(12000000000)
      );
      expect(result.current.totalCount).toBe(9999999);
      expect(result.current.transactionHistory).toStrictEqual([
        {
          category: "vouchers",
          name: "vouchers",
          quantityText: "9,999,999 qty",
          descriptionAlert: undefined,
          order: -1,
        },
      ]);
    });
    mockGetDailyStatistics.mockResolvedValueOnce({
      pastTransactions: [
        {
          category: "vouchers",
          quantity: 20,
          transactionTime: new Date(19000000000),
        },
      ],
    });

    currentTimestamp = 19000000000;

    rerender([key, endpoint, operatorToken, currentTimestamp]);
    await wait(() => {
      expect(mockGetDailyStatistics).toHaveBeenCalledTimes(2);
      expect(result.current.lastTransactionTime).toStrictEqual(
        new Date(19000000000)
      );
      expect(result.current.totalCount).toBe(20);
      expect(result.current.transactionHistory).toStrictEqual([
        {
          category: "vouchers",
          name: "vouchers",
          quantityText: "20 qty",
          descriptionAlert: undefined,
          order: -1,
        },
      ]);
    });
  });
});
