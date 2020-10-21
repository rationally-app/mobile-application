import {
  defaultIdentifier,
  defaultTranslationProps,
} from "../../../test/helpers/defaults";
import { PastTransactionsResult, CampaignPolicy, Quota } from "../../../types";
import {
  groupTransactionsByCategory,
  sortTransactions,
  TransactionsByCategoryMap,
  getLatestTransactionTime,
  checkHasAppealProduct,
} from "./NoQuotaCard";
import { Cart } from "../../../hooks/useCart/useCart";
import "../../../common/i18n/i18nMock";

describe("NoQuotaCard utility functions", () => {
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

  describe("checkHasAppealProduct", () => {
    const allQuotaResponseNoAppeal: Quota = {
      globalQuota: [
        {
          category: "appreciation-gift",
          quantity: 0,
          quotaRefreshTime: 1634800083079,
          transactionTime: new Date("2020-10-21T07:08:03.079Z"),
        },
        {
          category: "replacement-appreciation-gift",
          quantity: 0,
          quotaRefreshTime: 1634800102815,
          transactionTime: new Date("2020-10-21T07:08:22.815Z"),
        },
      ],
      localQuota: [
        {
          category: "appreciation-gift",
          quantity: 9007199254740991,
          quotaRefreshTime: 1634800083079,
        },
        {
          category: "replacement-appreciation-gift",
          quantity: 9007199254740991,
          quotaRefreshTime: 1634800102815,
        },
      ],
      remainingQuota: [
        {
          category: "appreciation-gift",
          quantity: 0,
          transactionTime: new Date("2020-10-21T07:08:03.079Z"),
        },
        {
          category: "replacement-appreciation-gift",
          quantity: 0,
          transactionTime: new Date("2020-10-21T07:08:22.815Z"),
        },
      ],
    };

    const allProductsAppealCategory: CampaignPolicy[] = [
      {
        category: "appreciation-gift",
        name: "🎁 Appreciation gift",
        order: 1,
        quantity: {
          default: 1,
          limit: 1,
          period: 365,
        },
        type: "REDEEM",
      },
      {
        category: "replacement-appreciation-gift",
        categoryType: "APPEAL",
        name: "🎁 Replacement",
        order: 1,
        quantity: {
          default: 1,
          limit: 1,
          period: 365,
        },
        type: "REDEEM",
      },
    ];

    const allQuotaResponseHasAppeal: Quota = {
      globalQuota: [
        {
          category: "appreciation-gift",
          quantity: 0,
          quotaRefreshTime: 1634803468038,
          transactionTime: new Date("2020-10-21T08:04:28.038Z"),
        },
        {
          category: "replacement-appreciation-gift",
          quantity: 1,
          quotaRefreshTime: 1634803476822,
        },
      ],
      localQuota: [
        {
          category: "appreciation-gift",
          quantity: 9007199254740991,
          quotaRefreshTime: 1634803468038,
        },
        {
          category: "replacement-appreciation-gift",
          quantity: 9007199254740991,
          quotaRefreshTime: 1634803476822,
        },
      ],
      remainingQuota: [
        {
          category: "appreciation-gift",
          quantity: 0,
          transactionTime: new Date("2020-10-21T08:04:28.038Z"),
        },
        {
          category: "replacement-appreciation-gift",
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
        type: "REDEEM",
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
        checkHasAppealProduct(
          allProductsAppealCategory,
          allQuotaResponseNoAppeal
        )
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

  describe("sortTransactions", () => {
    it("should return array of transactions by category, categories with latest transactions should be before the rest", () => {
      expect.assertions(1);
      expect(sortTransactions(mockTransactionsByCategoryMap)).toStrictEqual([
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
      expect(getLatestTransactionTime(cart)).toStrictEqual(
        latestTransactionTime
      );
    });

    it("should return undefined if cart is empty", () => {
      expect.assertions(1);
      expect(getLatestTransactionTime([])).toBeUndefined();
    });
  });
});
