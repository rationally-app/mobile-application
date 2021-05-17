import { CampaignPolicy, Quota } from "../../../types";
import { getLatestTransactionTime, checkHasAppealProduct } from "./NoQuotaCard";
import { Cart } from "../../../hooks/useCart/useCart";
import "../../../common/i18n/i18nMock";

describe("NoQuotaCard utility functions", () => {
  const latestTransactionTimeMs = 1596530350000;
  const latestTransactionTime = new Date(latestTransactionTimeMs);

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
