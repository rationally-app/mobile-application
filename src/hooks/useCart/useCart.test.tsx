import React, { FunctionComponent } from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { useCart } from "./useCart";
import { wait } from "@testing-library/react-native";
import { Quota, PostTransactionResult, CampaignPolicy } from "../../types";
import { postTransaction } from "../../services/quota";
import {
  defaultProducts,
  defaultIdentifier,
} from "../../test/helpers/defaults";
import { ProductContextProvider } from "../../context/products";
import { ERROR_MESSAGE } from "../../context/alert";

jest.mock("../../services/quota");
const mockPostTransaction = postTransaction as jest.Mock;

const key = "KEY";
const endpoint = "https://myendpoint.com";

const transactionTime = new Date(2020, 3, 1);

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
      transactionTime,
    },
    {
      category: "chocolate",
      quantity: 30,
      transactionTime,
    },
  ],
  globalQuota: [
    {
      category: "toilet-paper",
      quantity: 4,
      transactionTime,
    },
    {
      category: "chocolate",
      quantity: 30,
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

const mockPostTransactionResult: PostTransactionResult = {
  transactions: [
    {
      transaction: [
        {
          category: "toilet-paper",
          quantity: 1,
        },
        {
          category: "chocolate",
          quantity: 5,
        },
      ],
      timestamp: transactionTime,
    },
  ],
};

const mockQuotaResSingleIdAlert: Quota = {
  remainingQuota: [
    {
      category: "toilet-paper",
      quantity: 8,
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
      quantity: 8,
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

const defaultProductsIdentifierInputsForCart = [
  {
    label: "first",
    scanButtonType: "BARCODE",
    textInputType: "STRING",
    value: "",
  },
  {
    label: "last",
    scanButtonType: "BARCODE",
    textInputType: "STRING",
    value: "",
  },
];

const wrapper: FunctionComponent<{ products?: CampaignPolicy[] }> = ({
  children,
  products = defaultProducts,
}) => (
  <ProductContextProvider products={products}>
    {children}
  </ProductContextProvider>
);

describe("useCart", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("update cart quantities", () => {
    it("should update the cart when quota response changes", () => {
      expect.assertions(2);

      let ids = ["ID1"];
      let cartQuota = mockQuotaResSingleId.remainingQuota;
      const { rerender, result } = renderHook(
        () => useCart(ids, key, endpoint, cartQuota),
        { wrapper }
      );
      expect(result.current.cart).toStrictEqual([
        {
          category: "toilet-paper",
          descriptionAlert: undefined,
          identifierInputs: defaultProductsIdentifierInputsForCart,
          quantity: 1,
          lastTransactionTime: transactionTime,
          maxQuantity: 2,
        },
        {
          category: "chocolate",
          descriptionAlert: undefined,
          identifierInputs: defaultProductsIdentifierInputsForCart,
          quantity: 0,
          lastTransactionTime: transactionTime,
          maxQuantity: 15,
        },
      ]);

      ids = ["ID1", "ID2"];
      cartQuota = mockQuotaResMultipleIds.remainingQuota;
      rerender();

      expect(result.current.cart).toStrictEqual([
        {
          category: "toilet-paper",
          descriptionAlert: undefined,
          identifierInputs: defaultProductsIdentifierInputsForCart,
          lastTransactionTime: transactionTime,
          maxQuantity: 4,
          quantity: 1,
        },
        {
          category: "chocolate",
          descriptionAlert: undefined,
          identifierInputs: defaultProductsIdentifierInputsForCart,
          lastTransactionTime: transactionTime,
          maxQuantity: 30,
          quantity: 0,
        },
      ]);
    });

    it("should throw cartError when quota response has negative quantities", () => {
      expect.assertions(1);
      const ids = ["ID1"];
      const { result } = renderHook(
        () =>
          useCart(
            ids,
            key,
            endpoint,
            mockQuotaResSingleIdInvalidQuota.remainingQuota
          ),
        {
          wrapper,
        }
      );
      expect(result.current.cartError?.message).toBe(
        ERROR_MESSAGE.INVALID_QUANTITY
      );
    });

    it("should update the cart when quantities change", () => {
      expect.assertions(1);
      const ids = ["ID1"];
      const { result } = renderHook(
        () => useCart(ids, key, endpoint, mockQuotaResSingleId.remainingQuota),
        {
          wrapper,
        }
      );

      act(() => result.current.updateCart("chocolate", 5));
      expect(result.current.cart).toStrictEqual([
        {
          category: "toilet-paper",
          descriptionAlert: undefined,
          identifierInputs: defaultProductsIdentifierInputsForCart,
          lastTransactionTime: transactionTime,
          maxQuantity: 2,
          quantity: 1,
        },
        {
          category: "chocolate",
          descriptionAlert: undefined,
          identifierInputs: defaultProductsIdentifierInputsForCart,
          lastTransactionTime: transactionTime,
          maxQuantity: 15,
          quantity: 5,
        },
      ]);
    });

    it("should set cartError when updateCart is given a negative quantity", () => {
      expect.assertions(2);
      const ids = ["ID1"];
      const { result } = renderHook(
        () => useCart(ids, key, endpoint, mockQuotaResSingleId.remainingQuota),
        {
          wrapper,
        }
      );

      act(() => {
        result.current.updateCart("chocolate", -5);
      });

      expect(result.current.cartError?.message).toBe("Invalid quantity.");
      expect(result.current.cart).toStrictEqual([
        {
          category: "toilet-paper",
          descriptionAlert: undefined,
          identifierInputs: defaultProductsIdentifierInputsForCart,
          lastTransactionTime: transactionTime,
          maxQuantity: 2,
          quantity: 1,
        },
        {
          category: "chocolate",
          descriptionAlert: undefined,
          identifierInputs: defaultProductsIdentifierInputsForCart,
          lastTransactionTime: transactionTime,
          maxQuantity: 15,
          quantity: 0,
        },
      ]);
    });

    it("should set cartError when updateCart is given a quantity over the limit", () => {
      expect.assertions(2);
      const ids = ["ID1"];
      const { result } = renderHook(
        () => useCart(ids, key, endpoint, mockQuotaResSingleId.remainingQuota),
        {
          wrapper,
        }
      );

      act(() => {
        result.current.updateCart("chocolate", 100);
      });
      expect(result.current.cartError?.message).toBe("Insufficient quota.");
      expect(result.current.cart).toStrictEqual([
        {
          category: "toilet-paper",
          descriptionAlert: undefined,
          identifierInputs: defaultProductsIdentifierInputsForCart,
          lastTransactionTime: transactionTime,
          maxQuantity: 2,
          quantity: 1,
        },
        {
          category: "chocolate",
          descriptionAlert: undefined,
          identifierInputs: defaultProductsIdentifierInputsForCart,
          lastTransactionTime: transactionTime,
          maxQuantity: 15,
          quantity: 0,
        },
      ]);
    });

    it("should set cartError when updateCart is given a category that does not exist", () => {
      expect.assertions(2);
      const ids = ["ID1"];
      const { result } = renderHook(
        () => useCart(ids, key, endpoint, mockQuotaResSingleId.remainingQuota),
        {
          wrapper,
        }
      );

      act(() => {
        result.current.updateCart("eggs", 1);
      });
      expect(result.current.cartError?.message).toBe(
        "Category does not exist."
      );
      expect(result.current.cart).toStrictEqual([
        {
          category: "toilet-paper",
          descriptionAlert: undefined,
          identifierInputs: defaultProductsIdentifierInputsForCart,
          lastTransactionTime: transactionTime,
          maxQuantity: 2,
          quantity: 1,
        },
        {
          category: "chocolate",
          descriptionAlert: undefined,
          identifierInputs: defaultProductsIdentifierInputsForCart,
          lastTransactionTime: transactionTime,
          maxQuantity: 15,
          quantity: 0,
        },
      ]);
    });
  });

  describe("checkout cart", () => {
    it("should set the correct checkoutResult when checkoutCart is called", async () => {
      expect.assertions(4);
      const ids = ["ID1"];
      const { result } = renderHook(
        () => useCart(ids, key, endpoint, mockQuotaResSingleId.remainingQuota),
        {
          wrapper,
        }
      );

      await wait(() => {
        result.current.updateCart("toilet-paper", 2, [
          {
            label: "first",
            value: "first",
            textInputType: "STRING",
          },
        ]);
        result.current.updateCart("chocolate", 5, [
          {
            label: "last",
            value: "last",
            textInputType: "STRING",
          },
        ]);
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
          descriptionAlert: undefined,
          identifierInputs: [
            {
              label: "first",
              textInputType: "STRING",
              value: "first",
            },
          ],
          lastTransactionTime: transactionTime,
          maxQuantity: 2,
          quantity: 2,
        },
        {
          category: "chocolate",
          descriptionAlert: undefined,
          identifierInputs: [
            {
              label: "last",
              textInputType: "STRING",
              value: "last",
            },
          ],
          lastTransactionTime: transactionTime,
          maxQuantity: 15,
          quantity: 5,
        },
      ]);
      expect(result.current.checkoutResult).toStrictEqual(
        mockPostTransactionResult
      );
    });

    it("should show unsuccessful cart state when token mismatch error is received (return-pod)", async () => {
      expect.assertions(2);
      const ids = ["ID1"];
      const { result } = renderHook(
        () => useCart(ids, key, endpoint, mockQuotaResSingleId.remainingQuota),
        {
          wrapper,
        }
      );

      mockPostTransaction.mockRejectedValueOnce(
        new Error("Token does not match the customer's last registered token")
      );

      await wait(() => {
        result.current.updateCart("toilet-paper", 2, [
          {
            label: "first",
            value: "first",
            textInputType: "STRING",
          },
        ]);
        result.current.checkoutCart();
        expect(result.current.cartState).toBe("CHECKING_OUT");
      });

      expect(result.current.cartState).toBe("UNSUCCESSFUL");
    });

    it("should set cartError when no item was selected", async () => {
      expect.assertions(3);
      const ids = ["ID1"];
      const { result } = renderHook(
        () => useCart(ids, key, endpoint, mockQuotaResSingleId.remainingQuota),
        {
          wrapper,
        }
      );

      await wait(() => {
        result.current.updateCart("toilet-paper", 0);
        result.current.checkoutCart();
      });

      expect(result.current.cartError?.message).toBe(
        "Select at least one item to checkout."
      );
      expect(result.current.cartState).toBe("DEFAULT");
      expect(result.current.cart).toStrictEqual([
        {
          category: "toilet-paper",
          descriptionAlert: undefined,
          identifierInputs: defaultProductsIdentifierInputsForCart,
          lastTransactionTime: transactionTime,
          maxQuantity: 2,
          quantity: 0,
        },
        {
          category: "chocolate",
          descriptionAlert: undefined,
          identifierInputs: defaultProductsIdentifierInputsForCart,
          lastTransactionTime: transactionTime,
          maxQuantity: 15,
          quantity: 0,
        },
      ]);
    });

    it("should set cartError with message 'Enter or scan a code' when there are multiple identifiers and at least one is empty", async () => {
      expect.assertions(3);
      const ids = ["ID1"];
      const { result } = renderHook(
        () => useCart(ids, key, endpoint, mockQuotaResSingleId.remainingQuota),
        {
          wrapper,
        }
      );

      await wait(() => {
        result.current.updateCart("toilet-paper", 1, [
          {
            value: "",
            label: "first",
            textInputType: "STRING",
            scanButtonType: "BARCODE",
          },
          {
            value: "value",
            label: "last",
            textInputType: "STRING",
            scanButtonType: "BARCODE",
          },
        ]);
        result.current.checkoutCart();
      });

      expect(result.current.cartError?.message).toBe("Enter or scan a code.");
      expect(result.current.cartState).toBe("DEFAULT");
      expect(result.current.cart).toStrictEqual([
        {
          category: "toilet-paper",
          descriptionAlert: undefined,
          identifierInputs: [
            {
              value: "",
              label: "first",
              textInputType: "STRING",
              scanButtonType: "BARCODE",
            },
            {
              value: "value",
              label: "last",
              textInputType: "STRING",
              scanButtonType: "BARCODE",
            },
          ],
          lastTransactionTime: transactionTime,
          maxQuantity: 2,
          quantity: 1,
        },
        {
          category: "chocolate",
          descriptionAlert: undefined,
          identifierInputs: defaultProductsIdentifierInputsForCart,
          lastTransactionTime: transactionTime,
          maxQuantity: 15,
          quantity: 0,
        },
      ]);
    });

    it("should set cartError with message 'Enter or scan a code' when there is one identifier and it is empty", async () => {
      expect.assertions(3);

      const ids = ["ID1"];
      const { result } = renderHook(
        () =>
          useCart(ids, key, endpoint, [mockQuotaResSingleId.remainingQuota[0]]),
        {
          wrapper,
          initialProps: {
            products: [
              {
                ...defaultProducts[0],
                identifiers: [
                  {
                    ...defaultIdentifier,
                    label: "code",
                  },
                ],
              },
            ],
          },
        }
      );

      await wait(() => {
        result.current.updateCart("toilet-paper", 1, [
          {
            value: "",
            label: "first",
            textInputType: "STRING",
            scanButtonType: "BARCODE",
          },
        ]);
        result.current.checkoutCart();
      });

      expect(result.current.cartError?.message).toBe("Enter or scan a code.");
      expect(result.current.cartState).toBe("DEFAULT");
      expect(result.current.cart).toStrictEqual([
        {
          category: "toilet-paper",
          descriptionAlert: undefined,
          identifierInputs: [
            {
              value: "",
              label: "first",
              textInputType: "STRING",
              scanButtonType: "BARCODE",
            },
          ],
          lastTransactionTime: transactionTime,
          maxQuantity: 2,
          quantity: 1,
        },
      ]);
    });

    it("should set cartError with message 'Enter or scan a different code.' when identifier values are identical in the same category", async () => {
      expect.assertions(3);
      const ids = ["ID1"];
      const { result } = renderHook(
        () => useCart(ids, key, endpoint, mockQuotaResSingleId.remainingQuota),
        {
          wrapper,
        }
      );

      await wait(() => {
        result.current.updateCart("toilet-paper", 1, [
          {
            value: "identical",
            label: "first",
            textInputType: "STRING",
            scanButtonType: "BARCODE",
          },
          {
            value: "identical",
            label: "last",
            textInputType: "STRING",
            scanButtonType: "BARCODE",
          },
        ]);
        result.current.checkoutCart();
      });

      expect(result.current.cartError?.message).toBe(
        "Enter or scan a different code."
      );
      expect(result.current.cartState).toBe("DEFAULT");
      expect(result.current.cart).toStrictEqual([
        {
          category: "toilet-paper",
          descriptionAlert: undefined,
          identifierInputs: [
            {
              value: "identical",
              label: "first",
              textInputType: "STRING",
              scanButtonType: "BARCODE",
            },
            {
              value: "identical",
              label: "last",
              textInputType: "STRING",
              scanButtonType: "BARCODE",
            },
          ],
          lastTransactionTime: transactionTime,
          maxQuantity: 2,
          quantity: 1,
        },
        {
          category: "chocolate",
          descriptionAlert: undefined,
          identifierInputs: defaultProductsIdentifierInputsForCart,
          lastTransactionTime: transactionTime,
          maxQuantity: 15,
          quantity: 0,
        },
      ]);
    });

    it("should set cartError with message 'Enter or scan a different code.' when some identifier values are identical across different categories", async () => {
      expect.assertions(3);
      const ids = ["ID1"];
      const { result } = renderHook(
        () => useCart(ids, key, endpoint, mockQuotaResSingleId.remainingQuota),
        {
          wrapper,
        }
      );

      await wait(() => {
        result.current.updateCart("toilet-paper", 1, [
          {
            value: "identical",
            label: "first",
            textInputType: "STRING",
            scanButtonType: "BARCODE",
          },
          {
            value: "not identical",
            label: "last",
            textInputType: "STRING",
            scanButtonType: "BARCODE",
          },
        ]);
        result.current.updateCart("chocolate", 1, [
          {
            value: "also not identical",
            label: "first",
            textInputType: "STRING",
            scanButtonType: "BARCODE",
          },
          {
            value: "identical",
            label: "last",
            textInputType: "STRING",
            scanButtonType: "BARCODE",
          },
        ]);
        result.current.checkoutCart();
      });

      expect(result.current.cartError?.message).toBe(
        "Enter or scan a different code."
      );
      expect(result.current.cartState).toBe("DEFAULT");
      expect(result.current.cart).toStrictEqual([
        {
          category: "toilet-paper",
          descriptionAlert: undefined,
          identifierInputs: [
            {
              value: "identical",
              label: "first",
              textInputType: "STRING",
              scanButtonType: "BARCODE",
            },
            {
              value: "not identical",
              label: "last",
              textInputType: "STRING",
              scanButtonType: "BARCODE",
            },
          ],
          lastTransactionTime: transactionTime,
          maxQuantity: 2,
          quantity: 1,
        },
        {
          category: "chocolate",
          descriptionAlert: undefined,
          identifierInputs: [
            {
              value: "also not identical",
              label: "first",
              textInputType: "STRING",
              scanButtonType: "BARCODE",
            },
            {
              value: "identical",
              label: "last",
              textInputType: "STRING",
              scanButtonType: "BARCODE",
            },
          ],
          lastTransactionTime: transactionTime,
          maxQuantity: 15,
          quantity: 1,
        },
      ]);
    });

    it("should set cartError when there is an invalid mobile number", async () => {
      expect.assertions(3);
      const ids = ["ID1"];
      const MobileNumberIdentifierProductWrapper: FunctionComponent = ({
        children,
      }) => (
        <ProductContextProvider
          products={[
            {
              ...defaultProducts[0],
              identifiers: [
                {
                  label: "code",
                  textInput: {
                    visible: true,
                    disabled: false,
                    type: "PHONE_NUMBER",
                  },
                  scanButton: {
                    visible: false,
                    disabled: true,
                  },
                },
              ],
            },
          ]}
        >
          {children}
        </ProductContextProvider>
      );
      const { result } = renderHook(
        () =>
          useCart(ids, key, endpoint, [mockQuotaResSingleId.remainingQuota[0]]),
        {
          wrapper: MobileNumberIdentifierProductWrapper,
        }
      );

      await wait(() => {
        result.current.updateCart("toilet-paper", 1, [
          {
            value: "+659",
            label: "code",
            textInputType: "PHONE_NUMBER",
          },
        ]);
        result.current.checkoutCart();
      });

      expect(result.current.cartError?.message).toBe(
        "Enter a valid country code and contact number."
      );
      expect(result.current.cartState).toBe("DEFAULT");
      expect(result.current.cart).toStrictEqual([
        {
          category: "toilet-paper",
          descriptionAlert: undefined,
          identifierInputs: [
            {
              value: "+659",
              label: "code",
              textInputType: "PHONE_NUMBER",
            },
          ],
          lastTransactionTime: transactionTime,
          maxQuantity: 2,
          quantity: 1,
        },
      ]);
    });

    it("should set cartError when there is an invalid identifier", async () => {
      expect.assertions(3);
      const ids = ["ID1"];
      const InvalidIdentifierProductWrapper: FunctionComponent = ({
        children,
      }) => (
        <ProductContextProvider
          products={[
            {
              ...defaultProducts[0],
              identifiers: [
                {
                  label: "code",
                  validationRegex: "^[a-z]{5}$",
                  textInput: {
                    visible: true,
                    disabled: false,
                    type: "STRING",
                  },
                  scanButton: {
                    visible: false,
                    disabled: true,
                  },
                },
              ],
            },
          ]}
        >
          {children}
        </ProductContextProvider>
      );
      const { result } = renderHook(
        () =>
          useCart(ids, key, endpoint, [mockQuotaResSingleId.remainingQuota[0]]),
        {
          wrapper: InvalidIdentifierProductWrapper,
        }
      );

      await wait(() => {
        result.current.updateCart("toilet-paper", 1, [
          {
            value: "01234",
            label: "code",
            textInputType: "STRING",
            validationRegex: "^[a-z]{5}$",
          },
        ]);
        result.current.checkoutCart();
      });

      expect(result.current.cartError?.message).toBe(
        "Enter or scan a valid code."
      );
      expect(result.current.cartState).toBe("DEFAULT");
      expect(result.current.cart).toStrictEqual([
        {
          category: "toilet-paper",
          descriptionAlert: undefined,
          identifierInputs: [
            {
              value: "01234",
              label: "code",
              textInputType: "STRING",
              validationRegex: "^[a-z]{5}$",
            },
          ],
          lastTransactionTime: transactionTime,
          maxQuantity: 2,
          quantity: 1,
        },
      ]);
    });

    it("should set general cartError when transaction does not succeed", async () => {
      expect.assertions(3);
      const ids = ["ID1"];
      const { result } = renderHook(
        () => useCart(ids, key, endpoint, mockQuotaResSingleId.remainingQuota),
        {
          wrapper,
        }
      );

      await wait(() => {
        result.current.updateCart("toilet-paper", 2, [
          {
            label: "first",
            value: "first",
            textInputType: "STRING",
          },
        ]);
        result.current.updateCart("chocolate", 5, [
          {
            label: "last",
            value: "last",
            textInputType: "STRING",
          },
        ]);
      });

      mockPostTransaction.mockRejectedValueOnce(new Error());

      await wait(() => {
        result.current.checkoutCart();
      });

      expect(result.current.cartError?.message).toBe(
        "We are currently facing server issues. Contact your in-charge if the problem persists."
      );
      expect(result.current.cartState).toBe("DEFAULT");
      expect(result.current.cart).toStrictEqual([
        {
          category: "toilet-paper",
          descriptionAlert: undefined,
          identifierInputs: [
            {
              label: "first",
              textInputType: "STRING",
              value: "first",
            },
          ],
          lastTransactionTime: transactionTime,
          maxQuantity: 2,
          quantity: 2,
        },
        {
          category: "chocolate",
          descriptionAlert: undefined,
          identifierInputs: [
            {
              label: "last",
              textInputType: "STRING",
              value: "last",
            },
          ],
          lastTransactionTime: transactionTime,
          maxQuantity: 15,
          quantity: 5,
        },
      ]);
    });

    it("should clear cart items when emptyCart is invoked", async () => {
      expect.assertions(1);
      const ids = ["ID1"];
      const { result } = renderHook(
        () =>
          useCart(ids, key, endpoint, mockQuotaResSingleIdAlert.remainingQuota),
        {
          wrapper,
        }
      );

      await wait(() => {
        result.current.emptyCart();
      });

      expect(result.current.cart).toStrictEqual([]);
    });
  });

  describe("cart with alert items", () => {
    it("should set alert description on cart item when threshold reach", () => {
      expect.assertions(2);
      const ids = ["ID1"];
      const AlertProductWrapper: FunctionComponent = ({ children }) => (
        <ProductContextProvider
          products={[
            {
              ...defaultProducts[0],
              alert: {
                threshold: 1,
                label: "*chargeable",
              },
              quantity: {
                period: 7,
                limit: 10,
                default: 0,
                checkoutLimit: 1,
              },
            },
            { ...defaultProducts[1] },
          ]}
        >
          {children}
        </ProductContextProvider>
      );
      const { result } = renderHook(
        () =>
          useCart(ids, key, endpoint, mockQuotaResSingleIdAlert.remainingQuota),
        {
          wrapper: AlertProductWrapper,
        }
      );

      expect(result.current.cartState).toBe("DEFAULT");
      expect(result.current.cart).toStrictEqual([
        {
          category: "toilet-paper",
          descriptionAlert: "*chargeable",
          identifierInputs: [
            {
              label: "first",
              value: "",
              textInputType: "STRING",
              scanButtonType: "BARCODE",
            },
            {
              label: "last",
              value: "",
              textInputType: "STRING",
              scanButtonType: "BARCODE",
            },
          ],
          lastTransactionTime: transactionTime,
          maxQuantity: 1,
          quantity: 0,
        },
        {
          category: "chocolate",
          descriptionAlert: undefined,
          identifierInputs: defaultProductsIdentifierInputsForCart,
          lastTransactionTime: transactionTime,
          maxQuantity: 15,
          quantity: 0,
        },
      ]);
    });

    it("should not set alert description on cart item when threshold not reach", () => {
      expect.assertions(2);
      const ids = ["ID1"];
      const AlertProductWrapper: FunctionComponent = ({ children }) => (
        <ProductContextProvider
          products={[
            {
              ...defaultProducts[0],
              alert: {
                threshold: 1,
                label: "*chargeable",
              },
              quantity: {
                period: 7,
                limit: 9,
                default: 0,
                checkoutLimit: 1,
              },
            },
            { ...defaultProducts[1] },
          ]}
        >
          {children}
        </ProductContextProvider>
      );
      const { result } = renderHook(
        () =>
          useCart(ids, key, endpoint, mockQuotaResSingleIdAlert.remainingQuota),
        {
          wrapper: AlertProductWrapper,
        }
      );
      expect(result.current.cartState).toBe("DEFAULT");
      expect(result.current.cart).toStrictEqual([
        {
          category: "toilet-paper",
          descriptionAlert: "*chargeable",
          identifierInputs: [
            {
              label: "first",
              value: "",
              textInputType: "STRING",
              scanButtonType: "BARCODE",
            },
            {
              label: "last",
              value: "",
              textInputType: "STRING",
              scanButtonType: "BARCODE",
            },
          ],
          lastTransactionTime: transactionTime,
          maxQuantity: 1,
          quantity: 0,
        },
        {
          category: "chocolate",
          descriptionAlert: undefined,
          identifierInputs: defaultProductsIdentifierInputsForCart,
          lastTransactionTime: transactionTime,
          maxQuantity: 15,
          quantity: 0,
        },
      ]);
    });
  });
});
