import {
  defaultIdentifier,
  defaultTranslationProps,
} from "../../test/helpers/defaults";
import {
  PastTransactionsResult,
  CampaignPolicy,
  PolicyIdentifier,
  IdentifierInput,
  ValidationType,
} from "../../types";
import {
  formatQuantityText,
  sortTransactionsByOrder,
  groupTransactionsByCategory,
  sortTransactionsByCategory,
  TransactionsByCategoryMap,
  isPodCampaign,
  isPodChargeable,
  removePaymentReceiptField,
} from "./utils";
import "../../common/i18n/i18nMock";
import { CartItem } from "../../hooks/useCart/useCart";

describe("formatQuantityText", () => {
  it("should return only the quantity when no unit is given", () => {
    expect.assertions(2);
    expect(formatQuantityText(2)).toBe("2");
    expect(formatQuantityText(0)).toBe("0");
  });

  it("should return the unit and quantity when prefix unit is given", () => {
    expect.assertions(2);
    expect(formatQuantityText(2, { type: "PREFIX", label: "$" })).toBe("$2");
    expect(formatQuantityText(0, { type: "PREFIX", label: "SGD " })).toBe(
      "SGD 0"
    );
  });

  it("should return the quantity and unit when postfix unit is given", () => {
    expect.assertions(2);
    expect(formatQuantityText(2, { type: "POSTFIX", label: "kg" })).toBe("2kg");
    expect(formatQuantityText(0, { type: "POSTFIX", label: " pack(s)" })).toBe(
      "0 pack(s)"
    );
  });
});

describe("sortTransactionsByOrder", () => {
  it("should sort objects by order field in ascending order", () => {
    expect.assertions(1);
    const arr = [
      { order: 2, someField: "ok", someOtherField: "yeah" },
      { order: 0, anotherField: "nah" },
      { order: 1, someField: "right" },
    ];
    arr.sort(sortTransactionsByOrder);

    expect(arr).toStrictEqual([
      { order: 0, anotherField: "nah" },
      { order: 1, someField: "right" },
      { order: 2, someField: "ok", someOtherField: "yeah" },
    ]);
  });
});

describe("Utility functions by category", () => {
  const mockTransactionsByCategoryMap: TransactionsByCategoryMap = {
    "TT token": {
      transactions: [
        {
          header: "4 Aug 2020, 4:39PM",
          details: "AAA987654321",
          quantity: "1 qty",
          isAppeal: false,
          order: -1,
        },
      ],
      hasLatestTransaction: true,
      order: 1,
    },
    "Meal credits": {
      transactions: [
        {
          header: "4 Aug 2020, 4:39PM",
          details: "",
          quantity: "$10",
          isAppeal: false,
          order: -1,
        },
        {
          header: "4 Aug 2020, 4:38PM",
          details: "",
          quantity: "$5",
          isAppeal: false,
          order: -1,
        },
      ],
      hasLatestTransaction: true,
      order: 0,
    },
    "CDC Vouchers": {
      transactions: [
        {
          header: "4 Aug 2020, 4:39PM",
          details: "AAA987654322",
          quantity: "1 book",
          isAppeal: false,
          order: -1,
        },
      ],
      hasLatestTransaction: false,
      order: 2,
    },
  };

  const latestTransactionTimeMs = 1596530350000;
  const latestTransactionTime = new Date(latestTransactionTimeMs);

  describe("groupTransactionsByCategory", () => {
    const allProducts: CampaignPolicy[] = [
      {
        category: "meal-credits",
        name: "Meal credits",
        order: 0,
        quantity: {
          period: 1,
          limit: 20,
          unit: { type: "PREFIX", label: "$" },
        },
      },
      {
        category: "tt-token",
        name: "TT token",
        order: 1,
        quantity: { period: 1, limit: 1 },
        identifiers: [
          {
            label: "Device code",
            textInput: { disabled: true, visible: true, type: "STRING" },
            scanButton: { disabled: false, visible: true, type: "QR" },
          },
        ],
      },
      {
        category: "vouchers",
        name: "CDC Vouchers",
        order: 2,
        quantity: {
          period: 1,
          limit: 1,
          unit: { type: "POSTFIX", label: " book" },
        },
        identifiers: [
          {
            label: "Voucher code",
            textInput: { disabled: false, visible: true, type: "STRING" },
            scanButton: { disabled: false, visible: true, type: "BARCODE" },
          },
        ],
      },
    ];

    const sortedTransactions: PastTransactionsResult["pastTransactions"] = [
      {
        category: "tt-token",
        quantity: 1,
        identifierInputs: [
          {
            ...defaultIdentifier,
            label: "Device code",
            value: "AAA987654321",
          },
        ],
        transactionTime: latestTransactionTime,
      },
      {
        category: "meal-credits",
        quantity: 10,
        transactionTime: latestTransactionTime,
      },
      {
        category: "vouchers",
        quantity: 1,
        identifierInputs: [
          {
            ...defaultIdentifier,
            label: "Voucher code",
            value: "AAA987654322",
          },
        ],
        transactionTime: new Date(latestTransactionTimeMs - 10000),
      },
      {
        category: "meal-credits",
        quantity: 5,
        transactionTime: new Date(latestTransactionTimeMs - 20000),
      },
    ];

    it("should return categories with latest transactions and other categories", () => {
      expect.assertions(1);

      expect(
        groupTransactionsByCategory(
          sortedTransactions,
          allProducts,
          latestTransactionTime,
          defaultTranslationProps
        )
      ).toStrictEqual(mockTransactionsByCategoryMap);
    });

    it("should return empty object if sortedTransactions is null", () => {
      expect.assertions(1);

      expect(
        groupTransactionsByCategory(
          null,
          allProducts,
          undefined,
          defaultTranslationProps
        )
      ).toStrictEqual({});
    });
  });

  describe("sortTransactionsByCategory", () => {
    it("should return array of transactions by category, categories with latest transactions should be before the rest", () => {
      expect.assertions(1);
      expect(
        sortTransactionsByCategory(mockTransactionsByCategoryMap)
      ).toStrictEqual([
        {
          header: "Meal credits",
          transactions: [
            {
              header: "4 Aug 2020, 4:39PM",
              details: "",
              quantity: "$10",
              isAppeal: false,
              order: 0,
            },
            {
              header: "4 Aug 2020, 4:38PM",
              details: "",
              quantity: "$5",
              isAppeal: false,
              order: 1,
            },
          ],
          order: 0,
        },
        {
          header: "TT token",
          transactions: [
            {
              header: "4 Aug 2020, 4:39PM",
              details: "AAA987654321",
              quantity: "1 qty",
              isAppeal: false,
              order: 2,
            },
          ],
          order: 1,
        },
        {
          header: "CDC Vouchers",
          transactions: [
            {
              header: "4 Aug 2020, 4:39PM",
              details: "AAA987654322",
              quantity: "1 book",
              isAppeal: false,
              order: 3,
            },
          ],
          order: 2,
        },
      ]);
    });
  });
});

describe("pod related utils", () => {
  const transactionTime = new Date(2020, 3, 1);
  const defaultProductsIdentifierInputsForCart: IdentifierInput[] = [
    {
      label: "Voucher",
      scanButtonType: "BARCODE",
      textInputType: "STRING",
      value: "",
    },
    {
      label: "Token",
      scanButtonType: "QR",
      textInputType: "STRING",
      value: "",
    },
  ];

  let idType: ValidationType;
  let validCartItem: CartItem;
  let validIdentifiers: PolicyIdentifier[];
  beforeEach(() => {
    validCartItem = {
      category: "toilet-paper",
      descriptionAlert: undefined,
      identifierInputs: defaultProductsIdentifierInputsForCart,
      quantity: 1,
      lastTransactionTime: transactionTime,
      maxQuantity: 2,
    };

    validIdentifiers = [
      {
        label: "Voucher",
        textInput: { visible: true, disabled: false, type: "STRING" },
        scanButton: {
          visible: true,
          disabled: false,
          type: "BARCODE",
          text: "Scan",
        },
      },
      {
        label: "Token",
        textInput: { visible: true, disabled: true, type: "STRING" },
        scanButton: {
          visible: true,
          disabled: false,
          type: "QR",
          text: "Scan",
        },
      },
    ];
  });

  describe("isPodCampaign", () => {
    it("should return true for pod campaign", () => {
      expect.assertions(1);
      validCartItem["category"] = "tt-token";
      expect(isPodCampaign(validCartItem.category)).toBe(true);
    });

    it("should return false for non-pod campaign", () => {
      expect.assertions(1);
      expect(isPodCampaign(validCartItem.category)).toBe(false);
    });
  });

  describe("isPodChargeable", () => {
    beforeAll(() => {
      idType = "NRIC";
    });

    describe("for non-passport customer", () => {
      it("should return true for tt-token-lost category", () => {
        expect.assertions(1);
        validCartItem["category"] = "tt-token-lost";
        validCartItem["descriptionAlert"] = "*chargeable";
        expect(isPodChargeable(idType, validIdentifiers, validCartItem)).toBe(
          true
        );
      });

      it("should return false for tt-token-lost category if it's not *chargeable", () => {
        expect.assertions(1);
        validCartItem["category"] = "tt-token-lost";
        expect(isPodChargeable(idType, validIdentifiers, validCartItem)).toBe(
          false
        );
      });

      it("should return false for non-pod category", () => {
        expect.assertions(1);
        expect(isPodChargeable(idType, validIdentifiers, validCartItem)).toBe(
          false
        );
      });

      it("should return false if there are no identifiers", () => {
        expect.assertions(1);
        expect(isPodChargeable(idType, [], validCartItem)).toBe(false);
      });
    });

    describe("for passport customer", () => {
      beforeAll(() => {
        idType = "PASSPORT";
      });

      it("should return true for tt-token category", () => {
        expect.assertions(1);
        validCartItem["category"] = "tt-token";
        expect(isPodChargeable(idType, validIdentifiers, validCartItem)).toBe(
          true
        );
      });

      it("should return true for any category", () => {
        expect.assertions(1);
        expect(isPodChargeable(idType, validIdentifiers, validCartItem)).toBe(
          true
        );
      });
    });
  });

  describe("removePaymentReceiptField", () => {
    it("should remove payment receipt field properly", () => {
      expect.assertions(1);
      validCartItem.identifierInputs.push({
        label: "Payment receipt number",
        scanButtonType: "QR",
        textInputType: "PAYMENT_RECEIPT",
        value: "",
      });
      expect(
        removePaymentReceiptField(
          [
            ...validIdentifiers,
            {
              label: "Payment receipt number",
              textInput: {
                visible: true,
                disabled: true,
                type: "PAYMENT_RECEIPT",
              },
              scanButton: {
                visible: true,
                disabled: false,
                type: "QR",
                text: "Scan",
              },
            },
          ],
          validCartItem
        )
      ).toStrictEqual({
        newIdentifiers: validIdentifiers,
        newCartItem: validCartItem,
      });
    });
  });
});
