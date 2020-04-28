import React, { FunctionComponent } from "react";
import { renderHook } from "@testing-library/react-hooks";
import { useCart } from "./useCart";
import { wait } from "@testing-library/react-native";
import { ProductContext } from "../../context/products";
import { Policy } from "../../types";
import { getQuota, postTransaction } from "../../services/quota";
import { getPolicies } from "../../services/policies";

jest.mock("../../services/quota");
const mockGetQuota = getQuota as jest.Mock;
const mockPostTransaction = postTransaction as jest.Mock;

jest.mock("../../services/policies");
const mockGetPolicies = getPolicies as jest.Mock;

const key = "KEY";
const endpoint = "https://myendpoint.com";

const defaultProducts: Policy[] = [
  {
    category: "toilet-paper",
    name: "Toilet Paper",
    description: "",
    order: 1,
    quantity: {
      period: 7,
      limit: 2,
      default: 1,
      unit: {
        type: "POSTFIX",
        label: " roll"
      }
    }
  },
  {
    category: "chocolate",
    name: "Chocolate",
    order: 2,
    quantity: {
      period: 7,
      limit: 15,
      default: 0,
      unit: {
        type: "POSTFIX",
        label: "bar"
      }
    }
  }
];

const Wrapper: FunctionComponent<{ products?: Policy[] }> = ({
  children,
  products = defaultProducts
}) => {
  const getProduct = (category: string): Policy | undefined =>
    products?.find(product => product.category === category) ?? undefined;
  return (
    <ProductContext.Provider
      value={{ products, getProduct, setProducts: jest.fn() }}
    >
      {children}
    </ProductContext.Provider>
  );
};

const transactionTime = new Date(2020, 3, 1);

const mockQuotaResSingleId = {
  remainingQuota: [
    {
      category: "toilet-paper",
      quantity: 2,
      transactionTime
    },
    {
      category: "chocolate",
      quantity: 15,
      transactionTime
    }
  ]
};
const mockQuotaResSingleIdNoQuota = {
  remainingQuota: [
    {
      category: "toilet-paper",
      quantity: 0,
      transactionTime
    },
    {
      category: "chocolate",
      quantity: 0,
      transactionTime
    }
  ]
};
const mockQuotaResMultipleIds = {
  remainingQuota: [
    {
      category: "toilet-paper",
      quantity: 4,
      lastTransactionTime: undefined
    },
    {
      category: "chocolate",
      quantity: 30,
      lastTransactionTime: undefined
    }
  ]
};

const mockPostTransactionResult = {
  transactions: [
    {
      category: "toilet-paper",
      quantity: 1,
      transactionTime
    },
    {
      category: "chocolate",
      quantity: 5,
      transactionTime
    }
  ]
};

describe("useCart", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("fetch quota on initialisation", () => {
    it("should initialise the cart with the correct values", async () => {
      expect.assertions(3);
      mockGetQuota.mockReturnValueOnce(mockQuotaResSingleId);

      const ids = ["ID1"];
      const { result, waitForNextUpdate } = renderHook(
        () => useCart(ids, key, endpoint),
        { wrapper: Wrapper }
      );
      expect(result.current.cartState).toBe("FETCHING_QUOTA");

      await waitForNextUpdate();
      expect(result.current.cartState).toBe("DEFAULT");
      expect(result.current.cart).toStrictEqual([
        {
          category: "toilet-paper",
          lastTransactionTime: transactionTime,
          maxQuantity: 2,
          quantity: 1
        },
        {
          category: "chocolate",
          lastTransactionTime: transactionTime,
          maxQuantity: 15,
          quantity: 0
        }
      ]);
    });

    it("should have cart state be NO_QUOTA when no quota is available", async () => {
      expect.assertions(3);
      mockGetQuota.mockReturnValueOnce(mockQuotaResSingleIdNoQuota);

      const ids = ["ID1"];
      const { result, waitForNextUpdate } = renderHook(
        () => useCart(ids, key, endpoint),
        { wrapper: Wrapper }
      );
      expect(result.current.cartState).toBe("FETCHING_QUOTA");

      await waitForNextUpdate();
      expect(result.current.cartState).toBe("NO_QUOTA");
      expect(result.current.cart).toStrictEqual([
        {
          category: "toilet-paper",
          lastTransactionTime: transactionTime,
          maxQuantity: 0,
          quantity: 0
        },
        {
          category: "chocolate",
          lastTransactionTime: transactionTime,
          maxQuantity: 0,
          quantity: 0
        }
      ]);
    });

    it("should fetch policies if there are no products in context", async () => {
      expect.assertions(2);
      mockGetQuota.mockReturnValueOnce(mockQuotaResSingleId);

      const ids = ["ID1"];
      const NoProductsWrapper: FunctionComponent = ({ children }) => (
        <Wrapper products={[]}>{children}</Wrapper>
      );
      const { result, waitForNextUpdate } = renderHook(
        () => useCart(ids, key, endpoint),
        { wrapper: NoProductsWrapper }
      );
      expect(result.current.cartState).toBe("FETCHING_QUOTA");

      await waitForNextUpdate();
      expect(mockGetPolicies).toHaveBeenCalledTimes(1);
    });
  });

  describe("update cart quantities", () => {
    it("should update the cart when more ids are added", async () => {
      expect.assertions(2);
      mockGetQuota.mockReturnValueOnce(mockQuotaResSingleId);

      let ids = ["ID1"];
      const { rerender, result, waitForNextUpdate } = renderHook(
        () => useCart(ids, key, endpoint),
        { wrapper: Wrapper }
      );

      await waitForNextUpdate();

      mockGetQuota.mockReturnValueOnce(mockQuotaResMultipleIds);
      ids = ["ID1", "ID2"];
      rerender([ids, key, endpoint]);

      await waitForNextUpdate();
      expect(result.current.cart).toStrictEqual([
        {
          category: "toilet-paper",
          lastTransactionTime: undefined,
          maxQuantity: 4,
          quantity: 1
        },
        {
          category: "chocolate",
          lastTransactionTime: undefined,
          maxQuantity: 30,
          quantity: 0
        }
      ]);
      expect(mockGetPolicies).toHaveBeenCalledTimes(0);
    });

    it("should update the cart when quantities change", async () => {
      expect.assertions(1);
      mockGetQuota.mockReturnValueOnce(mockQuotaResSingleId);
      const ids = ["ID1"];
      const { result, waitForNextUpdate } = renderHook(
        () => useCart(ids, key, endpoint),
        { wrapper: Wrapper }
      );

      await waitForNextUpdate();
      await wait(() => result.current.updateCart("chocolate", 5));
      expect(result.current.cart).toStrictEqual([
        {
          category: "toilet-paper",
          lastTransactionTime: transactionTime,
          maxQuantity: 2,
          quantity: 1
        },
        {
          category: "chocolate",
          lastTransactionTime: transactionTime,
          maxQuantity: 15,
          quantity: 5
        }
      ]);
    });

    it("should maintain cart quantities when more ids are added", async () => {
      expect.assertions(2);
      mockGetQuota.mockReturnValueOnce(mockQuotaResSingleId);
      let ids = ["ID1"];
      const { rerender, result, waitForNextUpdate } = renderHook(
        () => useCart(ids, key, endpoint),
        { wrapper: Wrapper }
      );

      await waitForNextUpdate();
      await wait(() => result.current.updateCart("chocolate", 5));
      expect(result.current.cart).toStrictEqual([
        {
          category: "toilet-paper",
          lastTransactionTime: transactionTime,
          maxQuantity: 2,
          quantity: 1
        },
        {
          category: "chocolate",
          lastTransactionTime: transactionTime,
          maxQuantity: 15,
          quantity: 5
        }
      ]);

      mockGetQuota.mockReturnValueOnce(mockQuotaResMultipleIds);
      ids = ["ID1", "ID2"];
      rerender([ids, key, endpoint]);
      await waitForNextUpdate();
      expect(result.current.cart).toStrictEqual([
        {
          category: "toilet-paper",
          lastTransactionTime: undefined,
          maxQuantity: 4,
          quantity: 1
        },
        {
          category: "chocolate",
          lastTransactionTime: undefined,
          maxQuantity: 30,
          quantity: 5
        }
      ]);
    });

    it("should set error when updateCart is given a negative quantity", async () => {
      expect.assertions(2);
      mockGetQuota.mockReturnValueOnce(mockQuotaResSingleId);
      const ids = ["ID1"];
      const { result } = renderHook(() => useCart(ids, key, endpoint), {
        wrapper: Wrapper
      });

      await wait(() => {
        result.current.updateCart("chocolate", -5);
      });

      expect(result.current.error?.message).toBe("Invalid quantity");
      expect(result.current.cart).toStrictEqual([
        {
          category: "toilet-paper",
          lastTransactionTime: transactionTime,
          maxQuantity: 2,
          quantity: 1
        },
        {
          category: "chocolate",
          lastTransactionTime: transactionTime,
          maxQuantity: 15,
          quantity: 0
        }
      ]);
    });

    it("should set error when updateCart is given a quantity over the limit", async () => {
      expect.assertions(2);
      mockGetQuota.mockReturnValueOnce(mockQuotaResSingleId);
      const ids = ["ID1"];
      const { result } = renderHook(() => useCart(ids, key, endpoint), {
        wrapper: Wrapper
      });

      await wait(() => {
        result.current.updateCart("chocolate", 100);
      });
      expect(result.current.error?.message).toBe("Insufficient quota");
      expect(result.current.cart).toStrictEqual([
        {
          category: "toilet-paper",
          lastTransactionTime: transactionTime,
          maxQuantity: 2,
          quantity: 1
        },
        {
          category: "chocolate",
          lastTransactionTime: transactionTime,
          maxQuantity: 15,
          quantity: 0
        }
      ]);
    });

    it("should set error when updateCart is given a category that does not exist", async () => {
      expect.assertions(2);
      mockGetQuota.mockReturnValueOnce(mockQuotaResSingleId);
      const ids = ["ID1"];
      const { result } = renderHook(() => useCart(ids, key, endpoint), {
        wrapper: Wrapper
      });

      await wait(() => {
        result.current.updateCart("eggs", 1);
      });
      expect(result.current.error?.message).toBe("Category does not exist");
      expect(result.current.cart).toStrictEqual([
        {
          category: "toilet-paper",
          lastTransactionTime: transactionTime,
          maxQuantity: 2,
          quantity: 1
        },
        {
          category: "chocolate",
          lastTransactionTime: transactionTime,
          maxQuantity: 15,
          quantity: 0
        }
      ]);
    });
  });

  describe("checkout cart", () => {
    it("should set the correct checkoutResult when checkoutCart is called", async () => {
      expect.assertions(4);
      mockGetQuota.mockReturnValueOnce(mockQuotaResSingleId);
      const ids = ["ID1"];
      const { result } = renderHook(() => useCart(ids, key, endpoint), {
        wrapper: Wrapper
      });

      await wait(() => {
        result.current.updateCart("toilet-paper", 2);
        result.current.updateCart("chocolate", 5);
      });

      mockPostTransaction.mockReturnValueOnce(mockPostTransactionResult);

      await wait(() => {
        result.current.checkoutCart();
        expect(result.current.cartState).toBe("CHECKING_OUT");
      });

      expect(result.current.cartState).toBe("PURCHASED");
      expect(result.current.cart).toStrictEqual([
        {
          category: "toilet-paper",
          lastTransactionTime: transactionTime,
          maxQuantity: 2,
          quantity: 2
        },
        {
          category: "chocolate",
          lastTransactionTime: transactionTime,
          maxQuantity: 15,
          quantity: 5
        }
      ]);
      expect(result.current.checkoutResult).toStrictEqual(
        mockPostTransactionResult
      );
    });

    it("should set error when no item was selected", async () => {
      expect.assertions(3);
      mockGetQuota.mockReturnValueOnce(mockQuotaResSingleId);
      const ids = ["ID1"];
      const { result } = renderHook(() => useCart(ids, key, endpoint), {
        wrapper: Wrapper
      });

      await wait(() => {
        result.current.updateCart("toilet-paper", 0);
        result.current.checkoutCart();
      });

      expect(result.current.error?.message).toBe(
        "Please select at least one item to checkout"
      );
      expect(result.current.cartState).toBe("DEFAULT");
      expect(result.current.cart).toStrictEqual([
        {
          category: "toilet-paper",
          lastTransactionTime: transactionTime,
          maxQuantity: 2,
          quantity: 0
        },
        {
          category: "chocolate",
          lastTransactionTime: transactionTime,
          maxQuantity: 15,
          quantity: 0
        }
      ]);
    });

    it("should set error when transaction does not succeed", async () => {
      expect.assertions(3);
      mockGetQuota.mockReturnValueOnce(mockQuotaResSingleId);
      const ids = ["ID1"];
      const { result } = renderHook(() => useCart(ids, key, endpoint), {
        wrapper: Wrapper
      });

      await wait(() => {
        result.current.updateCart("toilet-paper", 2);
        result.current.updateCart("chocolate", 5);
      });

      mockPostTransaction.mockRejectedValueOnce(
        new Error("error when checking out")
      );

      await wait(() => {
        result.current.checkoutCart();
      });

      expect(result.current.error?.message).toBe(
        "Couldn't checkout, please try again later"
      );
      expect(result.current.cartState).toBe("DEFAULT");
      expect(result.current.cart).toStrictEqual([
        {
          category: "toilet-paper",
          lastTransactionTime: transactionTime,
          maxQuantity: 2,
          quantity: 2
        },
        {
          category: "chocolate",
          lastTransactionTime: transactionTime,
          maxQuantity: 15,
          quantity: 5
        }
      ]);
    });
  });
});
