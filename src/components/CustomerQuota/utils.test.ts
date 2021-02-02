import { PastTransactionsResult, CampaignPolicy, Quota } from "../../types";
import {
  formatQuantityText,
  sortTransactionsByOrder,
  checkHasAppealProduct,
  getLatestTransactionTime,
  TransactionsByTimeMap,
  groupTransactionsByTime,
  sortTransactionsByTime,
  TransactionsByCategoryMap,
  groupTransactionsByCategory,
  sortTransactionsByCategory,
} from "./utils";
import {
  defaultIdentifier,
  defaultTranslationProps,
} from "../../test/helpers/defaults";
import { Cart } from "../../hooks/useCart/useCart";
import "../../common/i18n/i18nMock";

const latestTransactionTimeMs = 1596530350000;
const latestTransactionTime = new Date(latestTransactionTimeMs);

describe("formatQuantityText", () => {
  it("should return only the quantity when no unit is given", () => {
    expect.assertions(2);
    expect(formatQuantityText(2)).toStrictEqual("2");
    expect(formatQuantityText(0)).toStrictEqual("0");
  });

  it("should return the unit and quantity when prefix unit is given", () => {
    expect.assertions(2);
    expect(formatQuantityText(2, { type: "PREFIX", label: "$" })).toStrictEqual(
      "$2"
    );
    expect(
      formatQuantityText(0, { type: "PREFIX", label: "SGD " })
    ).toStrictEqual("SGD 0");
  });

  it("should return the quantity and unit when postfix unit is given", () => {
    expect.assertions(2);
    expect(
      formatQuantityText(2, { type: "POSTFIX", label: "kg" })
    ).toStrictEqual("2kg");
    expect(
      formatQuantityText(0, { type: "POSTFIX", label: " pack(s)" })
    ).toStrictEqual("0 pack(s)");
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

describe("getLatestTransactionTime", () => {
  it("should return latest transaction time from cart", () => {
    expect.assertions(1);
    const cart: Cart = [
      {
        category: "category-a",
        quantity: 1,
        maxQuantity: 1,
        lastTransactionTime: new Date(latestTransactionTimeMs - 5000),
        identifierInputs: [],
      },
      {
        category: "category-b",
        quantity: 1,
        maxQuantity: 1,
        lastTransactionTime: new Date(latestTransactionTimeMs - 2000),
        identifierInputs: [],
      },
      {
        category: "category-c",
        quantity: 1,
        maxQuantity: 1,
        lastTransactionTime: latestTransactionTime,
        identifierInputs: [],
      },
      {
        category: "category-d",
        quantity: 1,
        maxQuantity: 1,
        lastTransactionTime: new Date(latestTransactionTimeMs - 3000),
        identifierInputs: [],
      },
    ];
    expect(getLatestTransactionTime(cart)).toStrictEqual(latestTransactionTime);
  });

  it("should return undefined if cart is empty", () => {
    expect.assertions(1);
    expect(getLatestTransactionTime([])).toBeUndefined();
  });
});

describe("checkHasAppealProduct", () => {
  const allQuotaResponseNoAppeal: Quota = {
    globalQuota: [
      {
        category: "gift",
        quantity: 0,
        quotaRefreshTime: 1634800083079,
        transactionTime: latestTransactionTime,
      },
      {
        category: "replacement-gift",
        quantity: 0,
        quotaRefreshTime: 1634800102815,
        transactionTime: latestTransactionTime,
      },
    ],
    localQuota: [
      {
        category: "gift",
        quantity: 9007199254740991,
        quotaRefreshTime: 1634800083079,
      },
      {
        category: "replacement-gift",
        quantity: 9007199254740991,
        quotaRefreshTime: 1634800102815,
      },
    ],
    remainingQuota: [
      {
        category: "gift",
        quantity: 0,
        transactionTime: new Date("2020-10-21T07:08:03.079Z"),
      },
      {
        category: "replacement-gift",
        quantity: 0,
        transactionTime: new Date("2020-10-21T07:08:22.815Z"),
      },
    ],
  };

  const allProductsAppealCategory: CampaignPolicy[] = [
    {
      category: "gift",
      name: "🎁 Appreciation gift",
      order: 1,
      quantity: {
        default: 1,
        limit: 1,
        period: 365,
      },
    },
    {
      category: "replacement-gift",
      categoryType: "APPEAL",
      name: "🎁 Replacement",
      order: 1,
      quantity: {
        default: 1,
        limit: 1,
        period: 365,
      },
    },
  ];

  const allQuotaResponseHasAppeal: Quota = {
    globalQuota: [
      {
        category: "gift",
        quantity: 0,
        quotaRefreshTime: 1634803468038,
        transactionTime: new Date("2020-10-21T08:04:28.038Z"),
      },
      {
        category: "replacement-gift",
        quantity: 1,
        quotaRefreshTime: 1634803476822,
      },
    ],
    localQuota: [
      {
        category: "gift",
        quantity: 9007199254740991,
        quotaRefreshTime: 1634803468038,
      },
      {
        category: "replacement-gift",
        quantity: 9007199254740991,
        quotaRefreshTime: 1634803476822,
      },
    ],
    remainingQuota: [
      {
        category: "gift",
        quantity: 0,
        transactionTime: new Date("2020-10-21T08:04:28.038Z"),
      },
      {
        category: "replacement-gift",
        quantity: 1,
      },
    ],
  };

  const allProductsNoAppealCategory: CampaignPolicy[] = [
    {
      category: "meal-credits",
      name: "🍚 Meal Credit(s)",
      order: 1,
      quantity: {
        checkoutLimit: 1,
        default: 1,
        limit: 3,
        period: -1,
        periodExpression: "0/20 * * * *",
        periodType: "CRON",
        usage: {
          limit: 1,
          periodExpression: "0/5 * * * *",
          periodType: "CRON",
        },
      },
    },
  ];

  const allQuotaResponseCategoryNoAppeal: Quota = {
    globalQuota: [
      {
        category: "meal-credits",
        quantity: 2,
        quotaRefreshTime: 1603274400000,
        transactionTime: new Date("2020-10-21T09:45:04.648Z"),
      },
    ],
    localQuota: [
      {
        category: "meal-credits",
        quantity: 0,
        quotaRefreshTime: 1603273800000,
        transactionTime: new Date("2020-10-21T09:45:04.648Z"),
      },
    ],
    remainingQuota: [
      {
        category: "meal-credits",
        quantity: 0,
        transactionTime: new Date("2020-10-21T09:45:04.648Z"),
      },
    ],
  };

  it("should return false when product has no appeal category type", () => {
    expect.assertions(1);
    expect(
      checkHasAppealProduct(
        allProductsNoAppealCategory,
        allQuotaResponseCategoryNoAppeal
      )
    ).toBe(false);
  });

  it("should return false when quota for the appeal category is zero", () => {
    expect.assertions(1);
    expect(
      checkHasAppealProduct(allProductsAppealCategory, allQuotaResponseNoAppeal)
    ).toBe(false);
  });

  it("should return true when quota for the appeal category is more than zero", () => {
    expect.assertions(1);
    expect(
      checkHasAppealProduct(
        allProductsAppealCategory,
        allQuotaResponseHasAppeal
      )
    ).toBe(true);
  });
});

describe("Utility functions by time", () => {
  let sortedTransactions: PastTransactionsResult["pastTransactions"];
  let allProducts: CampaignPolicy[];
  let mockTransactionsByTimeMap: TransactionsByTimeMap;

  beforeAll(() => {
    sortedTransactions = [
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
    allProducts = [
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

    mockTransactionsByTimeMap = {
      "1596530350": {
        transactionTime: latestTransactionTime,
        transactions: [
          {
            header: "TT token",
            details: "AAA987654321",
            quantity: "1 qty",
            isAppeal: false,
            order: 1,
          },
          {
            header: "Meal credits",
            details: "",
            quantity: "$10",
            isAppeal: false,
            order: 0,
          },
        ],
        order: -1596530350,
      },
      "1596530340": {
        transactionTime: new Date(latestTransactionTimeMs - 10000),
        transactions: [
          {
            header: "CDC Vouchers",
            details: "AAA987654322",
            quantity: "1 book",
            isAppeal: false,
            order: 2,
          },
        ],
        order: -1596530340,
      },
      "1596530330": {
        transactionTime: new Date(latestTransactionTimeMs - 20000),
        transactions: [
          {
            header: "Meal credits",
            details: "",
            quantity: "$5",
            isAppeal: false,
            order: 0,
          },
        ],
        order: -1596530330,
      },
    };
  });

  describe("groupTransactionsByTime", () => {
    it("should return transactions grouped by time rounded to seconds", () => {
      expect.assertions(1);

      expect(
        groupTransactionsByTime(
          sortedTransactions,
          allProducts,
          defaultTranslationProps
        )
      ).toStrictEqual(mockTransactionsByTimeMap);
    });

    it("should return empty object if sortedTransactions is null", () => {
      expect.assertions(1);

      expect(
        groupTransactionsByTime(null, allProducts, defaultTranslationProps)
      ).toStrictEqual({});
    });
  });

  describe("sortTransactionsByTime", () => {
    it("should return array of transactions by time, ordered by timestamp", () => {
      expect.assertions(1);
      expect(sortTransactionsByTime(mockTransactionsByTimeMap)).toStrictEqual([
        {
          header: "4 Aug 2020, 4:39PM",
          transactions: [
            {
              header: "Meal credits",
              details: "",
              quantity: "$10",
              isAppeal: false,
              order: 0,
            },
            {
              header: "TT token",
              details: "AAA987654321",
              quantity: "1 qty",
              isAppeal: false,
              order: 1,
            },
          ],
          order: -1596530350,
        },
        {
          header: "4 Aug 2020, 4:39PM",
          transactions: [
            {
              header: "CDC Vouchers",
              details: "AAA987654322",
              quantity: "1 book",
              isAppeal: false,
              order: 2,
            },
          ],
          order: -1596530340,
        },
        {
          header: "4 Aug 2020, 4:38PM",
          transactions: [
            {
              header: "Meal credits",
              details: "",
              quantity: "$5",
              isAppeal: false,
              order: 0,
            },
          ],
          order: -1596530330,
        },
      ]);
    });
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
