import React, { FunctionComponent } from "react";
import { act, renderHook } from "@testing-library/react-hooks";
import { useQuota } from "./useQuota";
import { CampaignPolicy, Quota } from "../../types";
import { NotEligibleError, getQuota } from "../../services/quota";
import {
  defaultNonAppealProducts,
  defaultProducts,
} from "../../test/helpers/defaults";
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
      quantity: 2,
      transactionTime,
    },
    {
      category: "chocolate",
      quantity: 15,
      transactionTime,
    },
  ],
  globalQuota: [
    {
      category: "toilet-paper",
      quantity: 2,
      transactionTime,
    },
    {
      category: "chocolate",
      quantity: 15,
      transactionTime,
    },
  ],
  localQuota: [
    {
      category: "toilet-paper",
      quantity: Number.MAX_SAFE_INTEGER,
      transactionTime,
    },
    {
      category: "chocolate",
      quantity: Number.MAX_SAFE_INTEGER,
      transactionTime,
    },
  ],
};

const mockQuotaResMultipleIds: Quota = {
  remainingQuota: [
    {
      category: "toilet-paper",
      quantity: 4,
    },
    {
      category: "chocolate",
      quantity: 30,
    },
  ],
  globalQuota: [
    {
      category: "toilet-paper",
      quantity: 4,
    },
    {
      category: "chocolate",
      quantity: 30,
    },
  ],
  localQuota: [
    {
      category: "toilet-paper",
      quantity: Number.MAX_SAFE_INTEGER,
    },
    {
      category: "chocolate",
      quantity: Number.MAX_SAFE_INTEGER,
    },
  ],
};

const mockQuotaResSingleIdWithIdentifiers: Quota = {
  remainingQuota: [
    {
      category: "toilet-paper",
      quantity: 1,
      transactionTime,
    },
    {
      category: "chocolate",
      quantity: 15,
      transactionTime,
    },
  ],
  globalQuota: [
    {
      category: "toilet-paper",
      quantity: 1,
      transactionTime,
    },
    {
      category: "chocolate",
      quantity: 15,
      transactionTime,
    },
  ],
  localQuota: [
    {
      category: "toilet-paper",
      quantity: Number.MAX_SAFE_INTEGER,
      transactionTime,
    },
    {
      category: "chocolate",
      quantity: Number.MAX_SAFE_INTEGER,
      transactionTime,
    },
  ],
};

const mockQuotaResSingleIdNoQuota: Quota = {
  remainingQuota: [
    {
      category: "toilet-paper",
      quantity: 0,
      transactionTime,
    },
    {
      category: "chocolate",
      quantity: 0,
      transactionTime,
    },
  ],
  globalQuota: [
    {
      category: "toilet-paper",
      quantity: 0,
      transactionTime,
    },
    {
      category: "chocolate",
      quantity: 0,
      transactionTime,
    },
  ],
  localQuota: [
    {
      category: "toilet-paper",
      quantity: Number.MAX_SAFE_INTEGER,
      transactionTime,
    },
    {
      category: "chocolate",
      quantity: Number.MAX_SAFE_INTEGER,
      transactionTime,
    },
  ],
};

const mockQuotaResSingleIdInvalidQuota: Quota = {
  remainingQuota: [
    {
      category: "toilet-paper",
      quantity: -1,
      transactionTime,
    },
    {
      category: "chocolate",
      quantity: 15,
      transactionTime,
    },
  ],
  globalQuota: [
    {
      category: "toilet-paper",
      quantity: -1,
      transactionTime,
    },
    {
      category: "chocolate",
      quantity: 15,
      transactionTime,
    },
  ],
  localQuota: [
    {
      category: "toilet-paper",
      quantity: Number.MAX_SAFE_INTEGER,
      transactionTime,
    },
    {
      category: "chocolate",
      quantity: Number.MAX_SAFE_INTEGER,
      transactionTime,
    },
  ],
};

const mockQuotaResSingleIdWithAppealProducts: Quota = {
  remainingQuota: [
    {
      category: "toilet-paper",
      quantity: 1,
      transactionTime,
    },
    {
      category: "chocolate",
      quantity: 0,
      transactionTime,
    },
  ],
  globalQuota: [
    {
      category: "toilet-paper",
      quantity: 1,
      transactionTime,
    },
    {
      category: "chocolate",
      quantity: 0,
      transactionTime,
    },
  ],
  localQuota: [
    {
      category: "toilet-paper",
      quantity: Number.MAX_SAFE_INTEGER,
      transactionTime,
    },
    {
      category: "chocolate",
      quantity: Number.MAX_SAFE_INTEGER,
      transactionTime,
    },
  ],
};

/**
 * This should be used alongside `defaultNonAppealProducts`,
 * which assumes that `toilet-paper` is a non-appeal product,
 * and `chocolate` is an appeal product.
 */
const mockQuotaResSingleIdNoQuotaWithAppealProducts: Quota = {
  remainingQuota: [
    {
      category: "toilet-paper",
      quantity: 0,
      transactionTime,
    },
    {
      category: "chocolate",
      quantity: 1,
      transactionTime,
    },
  ],
  globalQuota: [
    {
      category: "toilet-paper",
      quantity: 0,
      transactionTime,
    },
    {
      category: "chocolate",
      quantity: 1,
      transactionTime,
    },
  ],
  localQuota: [
    {
      category: "toilet-paper",
      quantity: Number.MAX_SAFE_INTEGER,
      transactionTime,
    },
    {
      category: "chocolate",
      quantity: Number.MAX_SAFE_INTEGER,
      transactionTime,
    },
  ],
};

const mockUserNotEligible: any = (id: string) => {
  if (!eligibleIds.includes(id)) {
    const errorMessage = "User is not eligible";
    throw new NotEligibleError(errorMessage);
  }
};

const mockIdNotEligible: any = (id: string) => {
  if (!eligibleIds.includes(id)) {
    const errorMessage = "id is not eligible";
    throw new NotEligibleError(errorMessage);
  }
};

const wrapper: FunctionComponent<{ products?: CampaignPolicy[] }> = ({
  products = defaultProducts,
  children,
}) => (
  <ProductContextProvider products={products}>
    {children}
  </ProductContextProvider>
);

describe("useQuota", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("fetch quota on initialisation", () => {
    it("should fetch quota once the hook is rendered", async () => {
      expect.assertions(3);
      mockGetQuota.mockReturnValueOnce(mockQuotaResSingleIdWithIdentifiers);

      const ids = ["ID1"];
      const { result, waitForNextUpdate } = renderHook(
        () => useQuota(ids, key, endpoint),
        { wrapper }
      );
      expect(result.current.quotaState).toBe("FETCHING_QUOTA");

      await waitForNextUpdate();
      expect(result.current.quotaState).toBe("DEFAULT");
      expect(result.current.quotaResponse?.remainingQuota).toStrictEqual([
        {
          category: "toilet-paper",
          identifierInputs: [
            {
              label: "first",
              value: "first identifier",
              textInputType: "STRING",
              scanButtonType: "BARCODE",
            },
            {
              label: "last",
              value: "last identifier",
              textInputType: "STRING",
              scanButtonType: "BARCODE",
            },
          ],
          transactionTime,
          quantity: 1,
        },
        {
          category: "chocolate",
          identifierInputs: [],
          transactionTime,
          quantity: 15,
        },
      ]);
    });

    it("should have quota state be NO_QUOTA when no quota is available", async () => {
      expect.assertions(3);
      mockGetQuota.mockReturnValueOnce(mockQuotaResSingleIdNoQuota);

      const ids = ["ID1"];
      const { result, waitForNextUpdate } = renderHook(
        () => useQuota(ids, key, endpoint),
        { wrapper }
      );
      expect(result.current.quotaState).toBe("FETCHING_QUOTA");

      await waitForNextUpdate();
      expect(result.current.quotaState).toBe("NO_QUOTA");
      expect(result.current.quotaResponse?.remainingQuota).toStrictEqual([
        {
          category: "toilet-paper",
          identifierInputs: [],
          transactionTime,
          quantity: 0,
        },
        {
          category: "chocolate",
          identifierInputs: [],
          transactionTime,
          quantity: 0,
        },
      ]);
    });

    it("should have quota state be NO_QUOTA when quota received is invalid", async () => {
      expect.assertions(3);
      mockGetQuota.mockReturnValueOnce(mockQuotaResSingleIdInvalidQuota);

      const ids = ["ID1"];
      const { result, waitForNextUpdate } = renderHook(
        () => useQuota(ids, key, endpoint),
        { wrapper }
      );
      expect(result.current.quotaState).toBe("FETCHING_QUOTA");

      await waitForNextUpdate();
      expect(result.current.quotaState).toBe("NO_QUOTA");
      expect(result.current.quotaResponse?.remainingQuota).toStrictEqual([
        {
          category: "toilet-paper",
          identifierInputs: [],
          transactionTime,
          quantity: -1,
        },
        {
          category: "chocolate",
          identifierInputs: [],
          transactionTime,
          quantity: 15,
        },
      ]);
    });

    it("should set quota state to NOT_ELIGIBLE when NotEligibleError is thrown, and does not update quota response", async () => {
      expect.assertions(3);

      const ids = ["ID_NOT_ELIGIBLE"];
      mockGetQuota.mockImplementationOnce(() => {
        mockIdNotEligible(ids[0]);
      });

      const { result } = renderHook(() => useQuota(ids, key, endpoint), {
        wrapper,
      });

      expect(result.current.quotaState).toBe("NOT_ELIGIBLE");
      expect(result.current.allQuotaResponse).toBeUndefined();
      expect(result.current.quotaResponse).toBeUndefined();
    });

    it("should set quota state to NOT_ELIGIBLE when NotEligibleError is thrown and error message is 'User is not eligible', and does not update existing quota response", async () => {
      expect.assertions(4);

      let ids = ["ID1"];
      mockGetQuota.mockResolvedValueOnce(mockQuotaResSingleId);
      const { result, waitForNextUpdate, rerender } = renderHook(
        () => useQuota(ids, key, endpoint),
        {
          wrapper,
        }
      );
      await waitForNextUpdate();

      expect(result.current.quotaState).toBe("DEFAULT");
      expect(result.current.allQuotaResponse).toStrictEqual(
        mockQuotaResSingleId
      );

      ids = ["ID_NOT_ELIGIBLE"];
      mockGetQuota.mockImplementationOnce(() => {
        mockUserNotEligible(ids[0]);
      });
      rerender();

      expect(result.current.quotaState).toBe("NOT_ELIGIBLE");
      expect(result.current.allQuotaResponse).toStrictEqual(
        mockQuotaResSingleId
      );
    });

    it("should set quota state to NOT_ELIGIBLE when NotEligibleError is thrown and error message is 'id is not eligible', and does not update existing quota response", async () => {
      expect.assertions(4);

      let ids = ["ID1"];
      mockGetQuota.mockResolvedValueOnce(mockQuotaResSingleId);
      const { result, waitForNextUpdate, rerender } = renderHook(
        () => useQuota(ids, key, endpoint),
        {
          wrapper,
        }
      );
      await waitForNextUpdate();

      expect(result.current.quotaState).toBe("DEFAULT");
      expect(result.current.allQuotaResponse).toStrictEqual(
        mockQuotaResSingleId
      );

      ids = ["ID_NOT_ELIGIBLE"];
      mockGetQuota.mockImplementationOnce(() => {
        mockIdNotEligible(ids[0]);
      });
      rerender();

      expect(result.current.quotaState).toBe("NOT_ELIGIBLE");
      expect(result.current.allQuotaResponse).toStrictEqual(
        mockQuotaResSingleId
      );
    });
  });

  describe("quota should check only non-appeal products", () => {
    it("should set quota state to DEFAULT if non-appeal products quantities are non-zero", async () => {
      expect.assertions(1);

      const ids = ["ID1"];
      mockGetQuota.mockResolvedValueOnce(
        mockQuotaResSingleIdWithAppealProducts
      );
      const { result, waitForNextUpdate } = renderHook(
        () => useQuota(ids, key, endpoint),
        {
          wrapper,
          initialProps: {
            products: defaultNonAppealProducts,
          },
        }
      );
      await waitForNextUpdate();

      expect(result.current.quotaState).toStrictEqual("DEFAULT");
    });

    it("should set quota state to NO_QUOTA if non-appeal products quantities are zero", async () => {
      expect.assertions(1);

      const ids = ["ID1"];
      mockGetQuota.mockResolvedValueOnce(
        mockQuotaResSingleIdNoQuotaWithAppealProducts
      );
      const { result, waitForNextUpdate } = renderHook(
        () => useQuota(ids, key, endpoint),
        {
          wrapper,
          initialProps: {
            products: defaultNonAppealProducts,
          },
        }
      );
      await waitForNextUpdate();

      expect(result.current.quotaState).toStrictEqual("NO_QUOTA");
    });
  });

  describe("update quota when necessary", () => {
    it("should update when quota ids are added", async () => {
      expect.assertions(2);
      mockGetQuota.mockReturnValueOnce(mockQuotaResSingleId);
      let ids = ["ID1"];
      const { rerender, result, waitForNextUpdate } = renderHook(
        () => useQuota(ids, key, endpoint),
        { wrapper }
      );

      await waitForNextUpdate();
      expect(result.current.quotaResponse?.remainingQuota).toStrictEqual([
        {
          category: "toilet-paper",
          identifierInputs: [],
          transactionTime,
          quantity: 2,
        },
        {
          category: "chocolate",
          identifierInputs: [],
          transactionTime,
          quantity: 15,
        },
      ]);

      mockGetQuota.mockReturnValueOnce(mockQuotaResMultipleIds);
      ids = ["ID1", "ID2"];
      rerender();
      await waitForNextUpdate();
      expect(result.current.quotaResponse?.remainingQuota).toStrictEqual([
        {
          category: "toilet-paper",
          identifierInputs: [],
          quantity: 4,
        },
        {
          category: "chocolate",
          identifierInputs: [],
          quantity: 30,
        },
      ]);
    });

    it("should update the quota when products change", async () => {
      expect.assertions(3);
      const ids = ["ID1"];
      mockGetQuota.mockReturnValue(mockQuotaResSingleId);
      const { rerender, result, waitForNextUpdate } = renderHook(
        () => useQuota(ids, key, endpoint),
        {
          wrapper,
        }
      );
      await waitForNextUpdate();
      expect(result.current.quotaResponse?.remainingQuota).toStrictEqual([
        {
          category: "toilet-paper",
          identifierInputs: [],
          transactionTime,
          quantity: 2,
        },
        {
          category: "chocolate",
          identifierInputs: [],
          transactionTime,
          quantity: 15,
        },
      ]);
      act(() => {
        rerender({ products: [] });
      });
      await waitForNextUpdate();
      expect(result.current.quotaResponse?.remainingQuota).toStrictEqual([]);
      expect(mockGetQuota).toHaveBeenCalledTimes(2);
    });

    it("should not update the quota when products do not change", async () => {
      expect.assertions(2);
      const ids = ["ID1"];
      mockGetQuota.mockReturnValue(mockQuotaResSingleId);
      const { rerender, result, waitForNextUpdate } = renderHook(
        () => useQuota(ids, key, endpoint),
        {
          wrapper,
        }
      );
      await waitForNextUpdate();
      expect(result.current.quotaResponse?.remainingQuota).toStrictEqual([
        {
          category: "toilet-paper",
          identifierInputs: [],
          transactionTime,
          quantity: 2,
        },
        {
          category: "chocolate",
          identifierInputs: [],
          transactionTime,
          quantity: 15,
        },
      ]);
      act(() => {
        rerender({ products: defaultProducts });
      });
      expect(mockGetQuota).toHaveBeenCalledTimes(1);
    });
  });
});
