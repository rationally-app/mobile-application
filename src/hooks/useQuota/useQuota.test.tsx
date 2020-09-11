import React, { FunctionComponent } from "react";
import { renderHook } from "@testing-library/react-hooks";
import { useCart } from "../useCart/useCart";
import { wait } from "@testing-library/react-native";
import { Quota } from "../../types";
import { NotEligibleError, getQuota } from "../../services/quota";
import { defaultProducts } from "../../test/helpers/defaults";
import { ProductContextProvider } from "../../context/products";

jest.mock("../../services/quota");
const mockGetQuota = getQuota as jest.Mock;

const key = "KEY";
const endpoint = "https://myendpoint.com";

const transactionTime = new Date(2020, 3, 1);
const eligibleIds = ["ID1", "ID2"];

const mockQuotaResSingleId: Quota = {
  remainingQuota: [
    {
      category: "toilet-paper",
      identifierInputs: [],
      quantity: 2,
      transactionTime
    },
    {
      category: "chocolate",
      identifierInputs: [],
      quantity: 15,
      transactionTime
    }
  ]
};

const mockQuotaResMultipleIds: Quota = {
  remainingQuota: [
    {
      category: "toilet-paper",
      identifierInputs: [],
      quantity: 4
    },
    {
      category: "chocolate",
      identifierInputs: [],
      quantity: 30
    }
  ]
};

const mockQuotaResSingleIdWithIdentifiers: Quota = {
  remainingQuota: [
    {
      category: "toilet-paper",
      identifierInputs: [
        {
          label: "first",
          value: "first identifier",
          textInputType: "STRING",
          scanButtonType: "BARCODE"
        },
        {
          label: "last",
          value: "last identifier",
          textInputType: "STRING",
          scanButtonType: "BARCODE"
        }
      ],
      quantity: 1,
      transactionTime
    },
    {
      category: "chocolate",
      identifierInputs: [],
      quantity: 15,
      transactionTime
    }
  ]
};
const mockQuotaResSingleIdNoQuota: Quota = {
  remainingQuota: [
    {
      category: "toilet-paper",
      identifierInputs: [],
      quantity: 0,
      transactionTime
    },
    {
      category: "chocolate",
      identifierInputs: [],
      quantity: 0,
      transactionTime
    }
  ]
};

const mockQuotaResSingleIdInvalidQuota: Quota = {
  remainingQuota: [
    {
      category: "toilet-paper",
      identifierInputs: [],
      quantity: -1,
      transactionTime
    },
    {
      category: "chocolate",
      identifierInputs: [],
      quantity: 15,
      transactionTime
    }
  ]
};

const mockIdNotEligible: any = (id: string) => {
  if (!eligibleIds.includes(id)) {
    const errorMessage = "User is not eligible";
    throw new NotEligibleError(errorMessage);
  }
};

const wrapper: FunctionComponent = ({ children }) => (
  <ProductContextProvider products={defaultProducts}>
    {children}
  </ProductContextProvider>
);

describe("useQuota", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("fetch quota on initialisation", () => {
    it("should initialise the cart with the correct values", async () => {
      expect.assertions(3);
      mockGetQuota.mockReturnValueOnce(mockQuotaResSingleIdWithIdentifiers);

      const ids = ["ID1"];
      const { result, waitForNextUpdate } = renderHook(
        () => useCart(ids, key, endpoint),
        { wrapper }
      );
      expect(result.current.cartState).toBe("FETCHING_QUOTA");

      await waitForNextUpdate();
      expect(result.current.cartState).toBe("DEFAULT");
      expect(result.current.cart).toStrictEqual([
        {
          category: "toilet-paper",
          descriptionAlert: undefined,
          identifierInputs: [
            {
              label: "first",
              value: "first identifier",
              textInputType: "STRING",
              scanButtonType: "BARCODE"
            },
            {
              label: "last",
              value: "last identifier",
              textInputType: "STRING",
              scanButtonType: "BARCODE"
            }
          ],
          lastTransactionTime: transactionTime,
          maxQuantity: 1,
          quantity: 1
        },
        {
          category: "chocolate",
          descriptionAlert: undefined,
          identifierInputs: [],
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
        { wrapper }
      );
      expect(result.current.cartState).toBe("FETCHING_QUOTA");

      await waitForNextUpdate();
      expect(result.current.cartState).toBe("NO_QUOTA");
      expect(result.current.cart).toStrictEqual([
        {
          category: "toilet-paper",
          descriptionAlert: undefined,
          identifierInputs: [],
          lastTransactionTime: transactionTime,
          maxQuantity: 0,
          quantity: 0
        },
        {
          category: "chocolate",
          descriptionAlert: undefined,
          identifierInputs: [],
          lastTransactionTime: transactionTime,
          maxQuantity: 0,
          quantity: 0
        }
      ]);
    });
    it("should have cart state be NO_QUOTA when quota received is invalid", async () => {
      expect.assertions(3);
      mockGetQuota.mockReturnValueOnce(mockQuotaResSingleIdInvalidQuota);

      const ids = ["ID1"];
      const { result, waitForNextUpdate } = renderHook(
        () => useCart(ids, key, endpoint),
        { wrapper }
      );
      expect(result.current.cartState).toBe("FETCHING_QUOTA");

      await waitForNextUpdate();
      expect(result.current.cartState).toBe("NO_QUOTA");
      expect(result.current.cart).toStrictEqual([
        {
          category: "toilet-paper",
          descriptionAlert: undefined,
          identifierInputs: [],
          lastTransactionTime: transactionTime,
          maxQuantity: 0,
          quantity: 0
        },
        {
          category: "chocolate",
          descriptionAlert: undefined,
          identifierInputs: [],
          lastTransactionTime: transactionTime,
          maxQuantity: 15,
          quantity: 0
        }
      ]);
    });
    it("should set cart state to be NOT_ELIGIBLE when NotEligibleError is thrown, and would not continue with fetching quota", async () => {
      expect.assertions(1);

      const ids = ["ID_NOT_ELIGIBLE"];

      mockGetQuota.mockImplementation(() => {
        mockIdNotEligible(ids[0]);
      });

      const { result } = renderHook(() => useCart(ids, key, endpoint), {
        wrapper
      });

      expect(result.current.cartState).toBe("NOT_ELIGIBLE");
    });
  });

  describe("update quota when necessary", () => {
    it("should maintain cart quantities when more ids are added", async () => {
      expect.assertions(2);
      mockGetQuota.mockReturnValueOnce(mockQuotaResSingleId);
      let ids = ["ID1"];
      const { rerender, result, waitForNextUpdate } = renderHook(
        () => useCart(ids, key, endpoint),
        { wrapper }
      );

      await waitForNextUpdate();
      await wait(() => result.current.updateCart("chocolate", 5));
      expect(result.current.cart).toStrictEqual([
        {
          category: "toilet-paper",
          descriptionAlert: undefined,
          identifierInputs: [],
          lastTransactionTime: transactionTime,
          maxQuantity: 2,
          quantity: 1
        },
        {
          category: "chocolate",
          descriptionAlert: undefined,
          identifierInputs: [],
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
          descriptionAlert: undefined,
          identifierInputs: [],
          lastTransactionTime: undefined,
          maxQuantity: 4,
          quantity: 1
        },
        {
          category: "chocolate",
          descriptionAlert: undefined,
          identifierInputs: [],
          lastTransactionTime: undefined,
          maxQuantity: 30,
          quantity: 5
        }
      ]);
    });
  });
});
