import { renderHook } from "@testing-library/react-hooks";
import { useCart } from "./useCart";
import { wait } from "@testing-library/react-native";

const anyGlobal: any = global;
const mockFetch = jest.fn();
anyGlobal.fetch = mockFetch;

const mockQuotaResSingleId = {
  remainingQuota: [
    {
      category: "toilet-paper",
      quantity: 2,
      transactionTime: 1586095465905
    },
    { category: "chocolate", quantity: 15, transactionTime: 1586095465905 }
  ]
};
const mockQuotaResSingleIdNoQuota = {
  remainingQuota: [
    {
      category: "toilet-paper",
      quantity: 0,
      transactionTime: 1586095465905
    },
    { category: "chocolate", quantity: 0, transactionTime: 1586095465905 }
  ]
};
const mockQuotaResMultipleIds = {
  remainingQuota: [
    {
      category: "toilet-paper",
      quantity: 4,
      transactionTime: 1586095465905
    },
    { category: "chocolate", quantity: 30, transactionTime: 1586095465905 }
  ]
};

const mockTransaction = {
  transactions: [
    {
      category: "toilet-paper",
      quantity: 1,
      transactionTime: 1586095465905
    },
    { category: "chocolate", quantity: 5, transactionTime: 1586095465905 }
  ]
};

describe("useCart", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  describe("fetch quota on initialisation", () => {
    it("should initialise the cart with the correct values", async () => {
      expect.assertions(3);
      mockFetch.mockReturnValueOnce({
        then: () => mockQuotaResSingleId
      });
      const ids = ["ID1"];
      const { result, waitForNextUpdate } = renderHook(() =>
        useCart(ids, "CORRECT_KEY", "https://myendpoint.com")
      );
      expect(result.current.cartState).toBe("FETCHING_QUOTA");

      await waitForNextUpdate();
      expect(result.current.cartState).toBe("DEFAULT");
      expect(result.current.cart).toStrictEqual({
        "toilet-paper": {
          category: "toilet-paper",
          quantity: 0,
          maxQuantity: 2
        },
        chocolate: {
          category: "chocolate",
          quantity: 0,
          maxQuantity: 15
        }
      });
    });

    it("should have cart state be NO_QUOTA when no quota is available", async () => {
      expect.assertions(3);
      mockFetch.mockReturnValueOnce({
        then: () => mockQuotaResSingleIdNoQuota
      });
      const ids = ["ID1"];
      const { result, waitForNextUpdate } = renderHook(() =>
        useCart(ids, "CORRECT_KEY", "https://myendpoint.com")
      );
      expect(result.current.cartState).toBe("FETCHING_QUOTA");

      await waitForNextUpdate();
      expect(result.current.cartState).toBe("NO_QUOTA");
      expect(result.current.cart).toStrictEqual({
        "toilet-paper": {
          category: "toilet-paper",
          quantity: 0,
          maxQuantity: 0
        },
        chocolate: {
          category: "chocolate",
          quantity: 0,
          maxQuantity: 0
        }
      });
    });
  });

  describe("update cart quantities", () => {
    it("should update the cart when more ids are added", async () => {
      expect.assertions(1);
      mockFetch.mockReturnValueOnce({
        then: () => mockQuotaResSingleId
      });
      let ids = ["ID1"];
      const { rerender, result, waitForNextUpdate } = renderHook(() =>
        useCart(ids, "CORRECT_KEY", "https://myendpoint.com")
      );

      await waitForNextUpdate();

      mockFetch.mockReturnValueOnce({
        then: () => mockQuotaResMultipleIds
      });
      ids = ["ID1", "ID2"];
      rerender([ids, "CORRECT_KEY", "https://myendpoint.com"]);

      await waitForNextUpdate();
      expect(result.current.cart).toStrictEqual({
        "toilet-paper": {
          category: "toilet-paper",
          quantity: 0,
          maxQuantity: 4
        },
        chocolate: {
          category: "chocolate",
          quantity: 0,
          maxQuantity: 30
        }
      });
    });

    it("should update the cart when quantities change", async () => {
      expect.assertions(1);
      mockFetch.mockReturnValueOnce({
        then: () => mockQuotaResSingleId
      });
      const ids = ["ID1"];
      const { result, waitForNextUpdate } = renderHook(() =>
        useCart(ids, "CORRECT_KEY", "https://myendpoint.com")
      );

      await waitForNextUpdate();
      await wait(() => result.current.updateCart("chocolate", 5));
      expect(result.current.cart).toStrictEqual({
        "toilet-paper": {
          category: "toilet-paper",
          quantity: 0,
          maxQuantity: 2
        },
        chocolate: {
          category: "chocolate",
          quantity: 5,
          maxQuantity: 15
        }
      });
    });

    it("should maintain cart quantities when more ids are added", async () => {
      expect.assertions(2);
      mockFetch.mockReturnValueOnce({
        then: () => mockQuotaResSingleId
      });
      let ids = ["ID1"];
      const { rerender, result, waitForNextUpdate } = renderHook(() =>
        useCart(ids, "CORRECT_KEY", "https://myendpoint.com")
      );

      await waitForNextUpdate();
      await wait(() => result.current.updateCart("chocolate", 5));
      expect(result.current.cart).toStrictEqual({
        "toilet-paper": {
          category: "toilet-paper",
          quantity: 0,
          maxQuantity: 2
        },
        chocolate: {
          category: "chocolate",
          quantity: 5,
          maxQuantity: 15
        }
      });

      mockFetch.mockReturnValueOnce({
        then: () => mockQuotaResMultipleIds
      });
      ids = ["ID1", "ID2"];
      rerender([ids, "CORRECT_KEY", "https://myendpoint.com"]);
      await waitForNextUpdate();
      expect(result.current.cart).toStrictEqual({
        "toilet-paper": {
          category: "toilet-paper",
          quantity: 0,
          maxQuantity: 4
        },
        chocolate: {
          category: "chocolate",
          quantity: 5,
          maxQuantity: 30
        }
      });
    });

    it("should set error when updateCart is given a negative quantity", async () => {
      expect.assertions(2);
      mockFetch.mockReturnValueOnce({
        then: () => mockQuotaResSingleId
      });
      const ids = ["ID1"];
      const { result } = renderHook(() =>
        useCart(ids, "CORRECT_KEY", "https://myendpoint.com")
      );

      await wait(() => {
        result.current.updateCart("chocolate", -5);
      });

      expect(result.current.error?.message).toBe("Invalid quantity");
      expect(result.current.cart).toStrictEqual({
        "toilet-paper": {
          category: "toilet-paper",
          quantity: 0,
          maxQuantity: 2
        },
        chocolate: {
          category: "chocolate",
          quantity: 0,
          maxQuantity: 15
        }
      });
    });

    it("should set error when updateCart is given a quantity over the limit", async () => {
      expect.assertions(2);
      mockFetch.mockReturnValueOnce({
        then: () => mockQuotaResSingleId
      });
      const ids = ["ID1"];
      const { result } = renderHook(() =>
        useCart(ids, "CORRECT_KEY", "https://myendpoint.com")
      );

      await wait(() => {
        result.current.updateCart("chocolate", 100);
      });
      expect(result.current.error?.message).toBe("Insufficient quota");
      expect(result.current.cart).toStrictEqual({
        "toilet-paper": {
          category: "toilet-paper",
          quantity: 0,
          maxQuantity: 2
        },
        chocolate: {
          category: "chocolate",
          quantity: 0,
          maxQuantity: 15
        }
      });
    });

    it("should set error when updateCart is given a category that does not exist", async () => {
      expect.assertions(2);
      mockFetch.mockReturnValueOnce({
        then: () => mockQuotaResSingleId
      });
      const ids = ["ID1"];
      const { result } = renderHook(() =>
        useCart(ids, "CORRECT_KEY", "https://myendpoint.com")
      );

      await wait(() => {
        result.current.updateCart("eggs", 1);
      });
      expect(result.current.error?.message).toBe("Category does not exist");
      expect(result.current.cart).toStrictEqual({
        "toilet-paper": {
          category: "toilet-paper",
          quantity: 0,
          maxQuantity: 2
        },
        chocolate: {
          category: "chocolate",
          quantity: 0,
          maxQuantity: 15
        }
      });
    });
  });

  describe("checkout cart", () => {
    it("should set the correct checkoutResult when checkoutCart is called", async () => {
      expect.assertions(4);
      mockFetch.mockReturnValueOnce({
        then: () => mockQuotaResSingleId
      });
      const ids = ["ID1"];
      const { result } = renderHook(() =>
        useCart(ids, "CORRECT_KEY", "https://myendpoint.com")
      );

      await wait(() => {
        result.current.updateCart("toilet-paper", 1);
        result.current.updateCart("chocolate", 5);
      });

      mockFetch.mockReturnValueOnce({
        then: () => mockTransaction
      });

      await wait(() => {
        result.current.checkoutCart();
        expect(result.current.cartState).toBe("CHECKING_OUT");
      });

      expect(result.current.cartState).toBe("PURCHASED");
      expect(result.current.cart).toStrictEqual({
        "toilet-paper": {
          category: "toilet-paper",
          quantity: 1,
          maxQuantity: 2
        },
        chocolate: {
          category: "chocolate",
          quantity: 5,
          maxQuantity: 15
        }
      });
      expect(result.current.checkoutResult).toStrictEqual(mockTransaction);
    });

    it("should set error when no item was selected", async () => {
      expect.assertions(3);
      mockFetch.mockReturnValueOnce({
        then: () => mockQuotaResSingleId
      });
      const ids = ["ID1"];
      const { result } = renderHook(() =>
        useCart(ids, "CORRECT_KEY", "https://myendpoint.com")
      );

      await wait(() => {
        result.current.checkoutCart();
      });

      expect(result.current.error?.message).toBe(
        "Please select at least one item to checkout"
      );
      expect(result.current.cartState).toBe("DEFAULT");
      expect(result.current.cart).toStrictEqual({
        "toilet-paper": {
          category: "toilet-paper",
          quantity: 0,
          maxQuantity: 2
        },
        chocolate: {
          category: "chocolate",
          quantity: 0,
          maxQuantity: 15
        }
      });
    });

    it("should set error when transaction does not succeed", async () => {
      expect.assertions(3);
      mockFetch.mockReturnValueOnce({
        then: () => mockQuotaResSingleId
      });
      const ids = ["ID1"];
      const { result } = renderHook(() =>
        useCart(ids, "CORRECT_KEY", "https://myendpoint.com")
      );

      await wait(() => {
        result.current.updateCart("toilet-paper", 1);
        result.current.updateCart("chocolate", 5);
      });

      mockFetch.mockRejectedValueOnce(new Error("error when checking out"));

      await wait(() => {
        result.current.checkoutCart();
      });

      expect(result.current.error?.message).toBe(
        "Couldn't checkout, please try again later"
      );
      expect(result.current.cartState).toBe("DEFAULT");
      expect(result.current.cart).toStrictEqual({
        "toilet-paper": {
          category: "toilet-paper",
          quantity: 1,
          maxQuantity: 2
        },
        chocolate: {
          category: "chocolate",
          quantity: 5,
          maxQuantity: 15
        }
      });
    });
  });
});
