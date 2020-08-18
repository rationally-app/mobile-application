import React, { FunctionComponent } from "react";
import { renderHook } from "@testing-library/react-hooks";
import { useCart } from "./useCart";
import { wait } from "@testing-library/react-native";
import { Quota, PostTransactionResult } from "../../types";
import {
  getQuota,
  postTransaction,
  NotEligibleError
} from "../../services/quota";
import { getEnvVersion } from "../../services/envVersion";
import {
  Wrapper,
  defaultProducts,
  defaultIdentifier
} from "../../test/helpers/wrapper";

jest.mock("../../services/quota");
const mockGetQuota = getQuota as jest.Mock;
const mockPostTransaction = postTransaction as jest.Mock;

jest.mock("../../services/envVersion");
const mockGetEnvVersion = getEnvVersion as jest.Mock;

const key = "KEY";
const endpoint = "https://myendpoint.com";
const eligibleIds = ["ID1", "ID2"];

const transactionTime = new Date(2020, 3, 1);

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

const mockPostTransactionResult: PostTransactionResult = {
  transactions: [
    {
      transaction: [
        { category: "toilet-paper", identifierInputs: [], quantity: 1 },
        {
          category: "chocolate",
          identifierInputs: [],
          quantity: 5
        }
      ],
      timestamp: transactionTime
    }
  ]
};

const mockIdNotEligible: any = (id: string) => {
  if (!eligibleIds.includes(id)) {
    const errorMessage = "User is not eligible";
    throw new NotEligibleError(errorMessage);
  }
};

const mockQuotaResSingleIdAlert: Quota = {
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
      quantity: 8,
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

describe("useCart", () => {
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
        { wrapper: Wrapper }
      );
      expect(result.current.cartState).toBe("FETCHING_QUOTA");

      await waitForNextUpdate();
      expect(result.current.cartState).toBe("DEFAULT");
      expect(result.current.cart).toStrictEqual([
        {
          category: "toilet-paper",
          checkoutLimit: undefined,
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
          checkoutLimit: undefined,
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
        { wrapper: Wrapper }
      );
      expect(result.current.cartState).toBe("FETCHING_QUOTA");

      await waitForNextUpdate();
      expect(result.current.cartState).toBe("NO_QUOTA");
      expect(result.current.cart).toStrictEqual([
        {
          category: "toilet-paper",
          checkoutLimit: undefined,
          descriptionAlert: undefined,
          identifierInputs: [],
          lastTransactionTime: transactionTime,
          maxQuantity: 0,
          quantity: 0
        },
        {
          category: "chocolate",
          checkoutLimit: undefined,
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
        { wrapper: Wrapper }
      );
      expect(result.current.cartState).toBe("FETCHING_QUOTA");

      await waitForNextUpdate();
      expect(result.current.cartState).toBe("NO_QUOTA");
      expect(result.current.cart).toStrictEqual([
        {
          category: "toilet-paper",
          checkoutLimit: undefined,
          descriptionAlert: undefined,
          identifierInputs: [],
          lastTransactionTime: transactionTime,
          maxQuantity: 0,
          quantity: 0
        },
        {
          category: "chocolate",
          checkoutLimit: undefined,
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
        wrapper: Wrapper
      });

      expect(result.current.cartState).toBe("NOT_ELIGIBLE");
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
          checkoutLimit: undefined,
          descriptionAlert: undefined,
          identifierInputs: [],
          lastTransactionTime: undefined,
          maxQuantity: 4,
          quantity: 1
        },
        {
          category: "chocolate",
          checkoutLimit: undefined,
          descriptionAlert: undefined,
          identifierInputs: [],
          lastTransactionTime: undefined,
          maxQuantity: 30,
          quantity: 0
        }
      ]);
      expect(mockGetEnvVersion).toHaveBeenCalledTimes(0);
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
          checkoutLimit: undefined,
          descriptionAlert: undefined,
          identifierInputs: [],
          lastTransactionTime: transactionTime,
          maxQuantity: 2,
          quantity: 1
        },
        {
          category: "chocolate",
          checkoutLimit: undefined,
          descriptionAlert: undefined,
          identifierInputs: [],
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
          checkoutLimit: undefined,
          descriptionAlert: undefined,
          identifierInputs: [],
          lastTransactionTime: transactionTime,
          maxQuantity: 2,
          quantity: 1
        },
        {
          category: "chocolate",
          checkoutLimit: undefined,
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
          checkoutLimit: undefined,
          descriptionAlert: undefined,
          identifierInputs: [],
          lastTransactionTime: undefined,
          maxQuantity: 4,
          quantity: 1
        },
        {
          category: "chocolate",
          checkoutLimit: undefined,
          descriptionAlert: undefined,
          identifierInputs: [],
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
          checkoutLimit: undefined,
          descriptionAlert: undefined,
          identifierInputs: [],
          lastTransactionTime: transactionTime,
          maxQuantity: 2,
          quantity: 1
        },
        {
          category: "chocolate",
          checkoutLimit: undefined,
          descriptionAlert: undefined,
          identifierInputs: [],
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
          checkoutLimit: undefined,
          descriptionAlert: undefined,
          identifierInputs: [],
          lastTransactionTime: transactionTime,
          maxQuantity: 2,
          quantity: 1
        },
        {
          category: "chocolate",
          checkoutLimit: undefined,
          descriptionAlert: undefined,
          identifierInputs: [],
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
          checkoutLimit: undefined,
          descriptionAlert: undefined,
          identifierInputs: [],
          lastTransactionTime: transactionTime,
          maxQuantity: 2,
          quantity: 1
        },
        {
          category: "chocolate",
          checkoutLimit: undefined,
          descriptionAlert: undefined,
          identifierInputs: [],
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
          checkoutLimit: undefined,
          descriptionAlert: undefined,
          identifierInputs: [],
          lastTransactionTime: transactionTime,
          maxQuantity: 2,
          quantity: 2
        },
        {
          category: "chocolate",
          checkoutLimit: undefined,
          descriptionAlert: undefined,
          identifierInputs: [],
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
          checkoutLimit: undefined,
          descriptionAlert: undefined,
          identifierInputs: [],
          lastTransactionTime: transactionTime,
          maxQuantity: 2,
          quantity: 0
        },
        {
          category: "chocolate",
          checkoutLimit: undefined,
          descriptionAlert: undefined,
          identifierInputs: [],
          lastTransactionTime: transactionTime,
          maxQuantity: 15,
          quantity: 0
        }
      ]);
    });

    it("should set error with message 'Please enter unique details to checkout' when there are multiple identifiers and at least one is empty", async () => {
      expect.assertions(3);
      mockGetQuota.mockReturnValueOnce(mockQuotaResSingleId);
      const ids = ["ID1"];
      const { result } = renderHook(() => useCart(ids, key, endpoint), {
        wrapper: Wrapper
      });

      await wait(() => {
        result.current.updateCart("toilet-paper", 1, [
          {
            value: "",
            label: "first",
            textInputType: "STRING",
            scanButtonType: "BARCODE"
          },
          {
            value: "value",
            label: "last",
            textInputType: "STRING",
            scanButtonType: "BARCODE"
          }
        ]);
        result.current.checkoutCart();
      });

      expect(result.current.error?.message).toBe(
        "Please enter unique details to checkout"
      );
      expect(result.current.cartState).toBe("DEFAULT");
      expect(result.current.cart).toStrictEqual([
        {
          category: "toilet-paper",
          checkoutLimit: undefined,
          descriptionAlert: undefined,
          identifierInputs: [
            {
              value: "",
              label: "first",
              textInputType: "STRING",
              scanButtonType: "BARCODE"
            },
            {
              value: "value",
              label: "last",
              textInputType: "STRING",
              scanButtonType: "BARCODE"
            }
          ],
          lastTransactionTime: transactionTime,
          maxQuantity: 2,
          quantity: 1
        },
        {
          category: "chocolate",
          checkoutLimit: undefined,
          descriptionAlert: undefined,
          identifierInputs: [],
          lastTransactionTime: transactionTime,
          maxQuantity: 15,
          quantity: 0
        }
      ]);
    });

    it("should set error with message 'Please enter details to checkout' when there is one identifier and it is empty", async () => {
      expect.assertions(3);
      mockGetQuota.mockReturnValueOnce({
        remainingQuota: [mockQuotaResSingleId.remainingQuota[0]]
      });
      const ids = ["ID1"];
      const SingleIdentifierProductWrapper: FunctionComponent = ({
        children
      }) => (
        <Wrapper
          products={[
            {
              ...defaultProducts.policies[0],
              identifiers: [
                {
                  ...defaultIdentifier,
                  label: "code"
                }
              ]
            }
          ]}
        >
          {children}
        </Wrapper>
      );
      const { result } = renderHook(() => useCart(ids, key, endpoint), {
        wrapper: SingleIdentifierProductWrapper
      });

      await wait(() => {
        result.current.updateCart("toilet-paper", 1, [
          {
            value: "",
            label: "first",
            textInputType: "STRING",
            scanButtonType: "BARCODE"
          }
        ]);
        result.current.checkoutCart();
      });

      expect(result.current.error?.message).toBe(
        "Please enter details to checkout"
      );
      expect(result.current.cartState).toBe("DEFAULT");
      expect(result.current.cart).toStrictEqual([
        {
          category: "toilet-paper",
          checkoutLimit: undefined,
          descriptionAlert: undefined,
          identifierInputs: [
            {
              value: "",
              label: "first",
              textInputType: "STRING",
              scanButtonType: "BARCODE"
            }
          ],
          lastTransactionTime: transactionTime,
          maxQuantity: 2,
          quantity: 1
        }
      ]);
    });

    it("should set error with message 'Please enter unique details to checkout' when identifier values are identical in the same category", async () => {
      expect.assertions(3);
      mockGetQuota.mockReturnValueOnce(mockQuotaResSingleId);
      const ids = ["ID1"];
      const { result } = renderHook(() => useCart(ids, key, endpoint), {
        wrapper: Wrapper
      });

      await wait(() => {
        result.current.updateCart("toilet-paper", 1, [
          {
            value: "identical",
            label: "first",
            textInputType: "STRING",
            scanButtonType: "BARCODE"
          },
          {
            value: "identical",
            label: "last",
            textInputType: "STRING",
            scanButtonType: "BARCODE"
          }
        ]);
        result.current.checkoutCart();
      });

      expect(result.current.error?.message).toBe(
        "Please enter unique details to checkout"
      );
      expect(result.current.cartState).toBe("DEFAULT");
      expect(result.current.cart).toStrictEqual([
        {
          category: "toilet-paper",
          checkoutLimit: undefined,
          descriptionAlert: undefined,
          identifierInputs: [
            {
              value: "identical",
              label: "first",
              textInputType: "STRING",
              scanButtonType: "BARCODE"
            },
            {
              value: "identical",
              label: "last",
              textInputType: "STRING",
              scanButtonType: "BARCODE"
            }
          ],
          lastTransactionTime: transactionTime,
          maxQuantity: 2,
          quantity: 1
        },
        {
          category: "chocolate",
          checkoutLimit: undefined,
          descriptionAlert: undefined,
          identifierInputs: [],
          lastTransactionTime: transactionTime,
          maxQuantity: 15,
          quantity: 0
        }
      ]);
    });

    it("should set error with message 'Please enter unique details to checkout' when some identifier values are identical across different categories", async () => {
      expect.assertions(3);
      mockGetQuota.mockReturnValueOnce(mockQuotaResSingleId);
      const ids = ["ID1"];
      const { result } = renderHook(() => useCart(ids, key, endpoint), {
        wrapper: Wrapper
      });

      await wait(() => {
        result.current.updateCart("toilet-paper", 1, [
          {
            value: "identical",
            label: "first",
            textInputType: "STRING",
            scanButtonType: "BARCODE"
          },
          {
            value: "not identical",
            label: "last",
            textInputType: "STRING",
            scanButtonType: "BARCODE"
          }
        ]);
        result.current.updateCart("chocolate", 1, [
          {
            value: "also not identical",
            label: "first",
            textInputType: "STRING",
            scanButtonType: "BARCODE"
          },
          {
            value: "identical",
            label: "last",
            textInputType: "STRING",
            scanButtonType: "BARCODE"
          }
        ]);
        result.current.checkoutCart();
      });

      expect(result.current.error?.message).toBe(
        "Please enter unique details to checkout"
      );
      expect(result.current.cartState).toBe("DEFAULT");
      expect(result.current.cart).toStrictEqual([
        {
          category: "toilet-paper",
          checkoutLimit: undefined,
          descriptionAlert: undefined,
          identifierInputs: [
            {
              value: "identical",
              label: "first",
              textInputType: "STRING",
              scanButtonType: "BARCODE"
            },
            {
              value: "not identical",
              label: "last",
              textInputType: "STRING",
              scanButtonType: "BARCODE"
            }
          ],
          lastTransactionTime: transactionTime,
          maxQuantity: 2,
          quantity: 1
        },
        {
          category: "chocolate",
          checkoutLimit: undefined,
          descriptionAlert: undefined,
          identifierInputs: [
            {
              value: "also not identical",
              label: "first",
              textInputType: "STRING",
              scanButtonType: "BARCODE"
            },
            {
              value: "identical",
              label: "last",
              textInputType: "STRING",
              scanButtonType: "BARCODE"
            }
          ],
          lastTransactionTime: transactionTime,
          maxQuantity: 15,
          quantity: 1
        }
      ]);
    });

    it("should set error when there is an invalid mobile number", async () => {
      expect.assertions(3);
      mockGetQuota.mockReturnValueOnce({
        remainingQuota: [mockQuotaResSingleId.remainingQuota[0]]
      });
      const ids = ["ID1"];
      const MobileNumberIdentifierProductWrapper: FunctionComponent = ({
        children
      }) => (
        <Wrapper
          products={[
            {
              ...defaultProducts.policies[0],
              identifiers: [
                {
                  label: "code",
                  textInput: {
                    visible: true,
                    disabled: false,
                    type: "PHONE_NUMBER"
                  },
                  scanButton: {
                    visible: false,
                    disabled: true
                  }
                }
              ]
            }
          ]}
        >
          {children}
        </Wrapper>
      );
      const { result } = renderHook(() => useCart(ids, key, endpoint), {
        wrapper: MobileNumberIdentifierProductWrapper
      });

      await wait(() => {
        result.current.updateCart("toilet-paper", 1, [
          {
            value: "+659",
            label: "code",
            textInputType: "PHONE_NUMBER"
          }
        ]);
        result.current.checkoutCart();
      });

      expect(result.current.error?.message).toBe("Invalid contact number");
      expect(result.current.cartState).toBe("DEFAULT");
      expect(result.current.cart).toStrictEqual([
        {
          category: "toilet-paper",
          checkoutLimit: undefined,
          descriptionAlert: undefined,
          identifierInputs: [
            {
              value: "+659",
              label: "code",
              textInputType: "PHONE_NUMBER"
            }
          ],
          lastTransactionTime: transactionTime,
          maxQuantity: 2,
          quantity: 1
        }
      ]);
    });

    it("should set error when there is an invalid identifier", async () => {
      expect.assertions(3);
      mockGetQuota.mockReturnValueOnce({
        remainingQuota: [mockQuotaResSingleId.remainingQuota[0]]
      });
      const ids = ["ID1"];
      const InvalidIdentifierProductWrapper: FunctionComponent = ({
        children
      }) => (
        <Wrapper
          products={[
            {
              ...defaultProducts.policies[0],
              identifiers: [
                {
                  label: "code",
                  validationRegex: "^[a-z]{5}$",
                  textInput: {
                    visible: true,
                    disabled: false,
                    type: "STRING"
                  },
                  scanButton: {
                    visible: false,
                    disabled: true
                  }
                }
              ]
            }
          ]}
        >
          {children}
        </Wrapper>
      );
      const { result } = renderHook(() => useCart(ids, key, endpoint), {
        wrapper: InvalidIdentifierProductWrapper
      });

      await wait(() => {
        result.current.updateCart("toilet-paper", 1, [
          {
            value: "01234",
            label: "code",
            textInputType: "STRING",
            validationRegex: "^[a-z]{5}$"
          }
        ]);
        result.current.checkoutCart();
      });

      expect(result.current.error?.message).toBe("Invalid details");
      expect(result.current.cartState).toBe("DEFAULT");
      expect(result.current.cart).toStrictEqual([
        {
          category: "toilet-paper",
          checkoutLimit: undefined,
          descriptionAlert: undefined,
          identifierInputs: [
            {
              value: "01234",
              label: "code",
              textInputType: "STRING",
              validationRegex: "^[a-z]{5}$"
            }
          ],
          lastTransactionTime: transactionTime,
          maxQuantity: 2,
          quantity: 1
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
          checkoutLimit: undefined,
          descriptionAlert: undefined,
          identifierInputs: [],
          lastTransactionTime: transactionTime,
          maxQuantity: 2,
          quantity: 2
        },
        {
          category: "chocolate",
          checkoutLimit: undefined,
          descriptionAlert: undefined,
          identifierInputs: [],
          lastTransactionTime: transactionTime,
          maxQuantity: 15,
          quantity: 5
        }
      ]);
    });

    it("should clear cart items when emptyCart is invoked", async () => {
      expect.assertions(1);
      mockGetQuota.mockReturnValueOnce(mockQuotaResSingleId);
      const ids = ["ID1"];
      const { result } = renderHook(() => useCart(ids, key, endpoint), {
        wrapper: Wrapper
      });

      await wait(() => {
        result.current.emptyCart();
      });

      expect(result.current.cart).toStrictEqual([]);
    });
  });

  describe("cart with alert items", () => {
    it("should set alert description on cart item when threshold reach", async () => {
      expect.assertions(3);
      mockGetQuota.mockReturnValueOnce(mockQuotaResSingleIdAlert);

      const ids = ["ID1"];
      const AlertProductWrapper: FunctionComponent = ({ children }) => (
        <Wrapper
          products={[
            {
              ...defaultProducts.policies[0],
              alert: {
                threshold: 1,
                label: "*chargeable"
              },
              quantity: {
                period: 7,
                limit: 10,
                default: 0,
                checkoutLimit: 1
              }
            },
            { ...defaultProducts.policies[1] }
          ]}
        >
          {children}
        </Wrapper>
      );
      const { result, waitForNextUpdate } = renderHook(
        () => useCart(ids, key, endpoint),
        { wrapper: AlertProductWrapper }
      );
      expect(result.current.cartState).toBe("FETCHING_QUOTA");

      await waitForNextUpdate();
      expect(result.current.cartState).toBe("DEFAULT");
      expect(result.current.cart).toStrictEqual([
        {
          category: "toilet-paper",
          checkoutLimit: 1,
          descriptionAlert: "*chargeable",
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
          maxQuantity: 8,
          quantity: 0
        },
        {
          category: "chocolate",
          checkoutLimit: undefined,
          descriptionAlert: undefined,
          identifierInputs: [],
          lastTransactionTime: transactionTime,
          maxQuantity: 15,
          quantity: 0
        }
      ]);
    });

    it("should not set alert description on cart item when threshold not reach", async () => {
      expect.assertions(3);
      mockGetQuota.mockReturnValueOnce(mockQuotaResSingleIdAlert);

      const ids = ["ID1"];
      const AlertProductWrapper: FunctionComponent = ({ children }) => (
        <Wrapper
          products={[
            {
              ...defaultProducts.policies[0],
              alert: {
                threshold: 1,
                label: "*chargeable"
              },
              quantity: {
                period: 7,
                limit: 9,
                default: 0,
                checkoutLimit: 1
              }
            },
            { ...defaultProducts.policies[1] }
          ]}
        >
          {children}
        </Wrapper>
      );
      const { result, waitForNextUpdate } = renderHook(
        () => useCart(ids, key, endpoint),
        { wrapper: AlertProductWrapper }
      );
      expect(result.current.cartState).toBe("FETCHING_QUOTA");

      await waitForNextUpdate();
      expect(result.current.cartState).toBe("DEFAULT");
      expect(result.current.cart).toStrictEqual([
        {
          category: "toilet-paper",
          checkoutLimit: 1,
          descriptionAlert: "*chargeable",
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
          maxQuantity: 8,
          quantity: 0
        },
        {
          category: "chocolate",
          checkoutLimit: undefined,
          descriptionAlert: undefined,
          identifierInputs: [],
          lastTransactionTime: transactionTime,
          maxQuantity: 15,
          quantity: 0
        }
      ]);
    });
  });
});
