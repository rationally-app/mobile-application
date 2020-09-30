import { renderHook } from "@testing-library/react-hooks";
import { useFetchDailyStatistics } from "./useFetchDailyStatistics";
import { wait } from "@testing-library/react-native";

jest.mock("../../services/statistics");

const setGetStatisticsSpy = jest.fn();

describe("useFetchDailyStatistics", () => {
  beforeEach(() => {
    setGetStatisticsSpy.mockClear();
  });

  let dailyStats: {
    name: string;
    category: string;
    quantityText: string;
  }[];

  it("daily statistics hook should be initialised correctly", async () => {
    expect.assertions(5);
    const { result } = renderHook(() => useFetchDailyStatistics());
    expect(result.current.error).toBeUndefined();
    expect(result.current.totalCount).toBeNull();
    expect(result.current.lastTransactionTime).toBeNull();
    expect(result.current.transactionHistory).toMatchObject([]);
    expect(result.current.currentTimestamp).toBeLessThan(Date.now());
  });

  it("should be able to set total count, transaction history and timestamp", async () => {
    expect.assertions(3);

    dailyStats = [
      {
        name: "Maggi Mee",
        category: "instant-noodles",
        quantityText: "999 packs"
      },
      {
        name: "Hersheys",
        category: "chocolate",
        quantityText: "$3,000"
      }
    ];

    const { result } = renderHook(() => useFetchDailyStatistics());

    await wait(() => {
      result.current.setTotalCount(3999);
      result.current.setCurrentTimestamp(1200000000);
      result.current.setTransactionHistory(dailyStats);
    });

    expect(result.current.totalCount).toBe(3999);
    expect(result.current.currentTimestamp).toBe(1200000000);
    expect(result.current.transactionHistory).toStrictEqual([
      {
        category: "instant-noodles",
        name: "Maggi Mee",
        quantityText: "999 packs"
      },
      { category: "chocolate", name: "Hersheys", quantityText: "$3,000" }
    ]);
  });

  it("should be able to set clear all statistics", async () => {
    expect.assertions(6);

    dailyStats = [
      {
        name: "Maggi Mee",
        category: "instant-noodles",
        quantityText: "999 packs"
      },
      {
        name: "Hersheys",
        category: "chocolate",
        quantityText: "$3,000"
      }
    ];

    const { result } = renderHook(() => useFetchDailyStatistics());

    await wait(() => {
      result.current.setTotalCount(3999);
      result.current.setCurrentTimestamp(1200000000);
      result.current.setTransactionHistory(dailyStats);
    });

    expect(result.current.totalCount).toBe(3999);
    expect(result.current.currentTimestamp).toBe(1200000000);
    expect(result.current.transactionHistory).toStrictEqual([
      {
        category: "instant-noodles",
        name: "Maggi Mee",
        quantityText: "999 packs"
      },
      { category: "chocolate", name: "Hersheys", quantityText: "$3,000" }
    ]);

    await wait(() => {
      result.current.clearStatistics();
    });

    expect(result.current.totalCount).toBeNull();
    expect(result.current.currentTimestamp).toBeLessThanOrEqual(Date.now());
    expect(result.current.transactionHistory).toStrictEqual([]);
  });
});
