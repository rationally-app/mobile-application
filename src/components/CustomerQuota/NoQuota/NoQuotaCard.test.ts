import { defaultIdentifier } from "../../../test/helpers/defaults";
import { PastTransactionsResult, CampaignPolicy } from "../../../types";
import {
  groupTransactionsByCategory,
  sortTransactions,
  TransactionsByCategoryMap,
  getLatestTransactionTime
} from "./NoQuotaCard";
import { Cart } from "../../../hooks/useCart/useCart";
import "../../../common/i18n/i18nMock";

describe("NoQuotaCard utility functions", () => {
  let sortedTransactions: PastTransactionsResult["pastTransactions"];
  let allProducts: CampaignPolicy[];
  let mockTransactionsByCategoryMap: TransactionsByCategoryMap;

  const latestTransactionTimeMs = 1596530350000;
  const latestTransactionTime = new Date(latestTransactionTimeMs);

  beforeAll(() => {
    sortedTransactions = [
      {
        category: "tt-token",
        quantity: 1,
        identifierInputs: [
          {
            ...defaultIdentifier,
            label: "Device code",
            value: "AAA987654321"
          }
        ],
        transactionTime: latestTransactionTime
      },
      {
        category: "meal-credits",
        quantity: 10,
        transactionTime: latestTransactionTime
      },
      {
        category: "vouchers",
        quantity: 1,
        identifierInputs: [
          {
            ...defaultIdentifier,
            label: "Voucher code",
            value: "AAA987654322"
          }
        ],
        transactionTime: new Date(latestTransactionTimeMs - 10000)
      },
      {
        category: "meal-credits",
        quantity: 5,
        transactionTime: new Date(latestTransactionTimeMs - 20000)
      }
    ];
    allProducts = [
      {
        category: "meal-credits",
        name: "Meal credits",
        order: 0,
        quantity: { period: 1, limit: 20, unit: { type: "PREFIX", label: "$" } }
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
            scanButton: { disabled: false, visible: true, type: "QR" }
          }
        ]
      },
      {
        category: "vouchers",
        name: "CDC Vouchers",
        order: 2,
        quantity: {
          period: 1,
          limit: 1,
          unit: { type: "POSTFIX", label: " book" }
        },
        identifiers: [
          {
            label: "Voucher code",
            textInput: { disabled: false, visible: true, type: "STRING" },
            scanButton: { disabled: false, visible: true, type: "BARCODE" }
          }
        ]
      }
    ];

    mockTransactionsByCategoryMap = {
      "TT token": {
        transactions: [
          {
            header: "4 Aug 2020, 4:39PM",
            details: "AAA987654321",
            quantity: "1 qty",
            isAppeal: false,
            order: -1
          }
        ],
        hasLatestTransaction: true,
        order: 1
      },
      "Meal credits": {
        transactions: [
          {
            header: "4 Aug 2020, 4:39PM",
            details: "",
            quantity: "$10",
            isAppeal: false,
            order: -1
          },
          {
            header: "4 Aug 2020, 4:38PM",
            details: "",
            quantity: "$5",
            isAppeal: false,
            order: -1
          }
        ],
        hasLatestTransaction: true,
        order: 0
      },
      "CDC Vouchers": {
        transactions: [
          {
            header: "4 Aug 2020, 4:39PM",
            details: "AAA987654322",
            quantity: "1 book",
            isAppeal: false,
            order: -1
          }
        ],
        hasLatestTransaction: false,
        order: 2
      }
    };
  });

  describe("groupTransactionsByCategory", () => {
    it("should return categories with latest transactions and other categories", () => {
      expect.assertions(1);

      expect(
        groupTransactionsByCategory(
          sortedTransactions,
          allProducts,
          latestTransactionTime
        )
      ).toStrictEqual(mockTransactionsByCategoryMap);
    });

    it("should return empty object if sortedTransactions is null", () => {
      expect.assertions(1);

      expect(
        groupTransactionsByCategory(null, allProducts, undefined)
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
              order: 0
            },
            {
              header: "4 Aug 2020, 4:38PM",
              details: "",
              quantity: "$5",
              isAppeal: false,
              order: 1
            }
          ],
          order: 0
        },
        {
          header: "TT token",
          transactions: [
            {
              header: "4 Aug 2020, 4:39PM",
              details: "AAA987654321",
              quantity: "1 qty",
              isAppeal: false,
              order: 2
            }
          ],
          order: 1
        },
        {
          header: "CDC Vouchers",
          transactions: [
            {
              header: "4 Aug 2020, 4:39PM",
              details: "AAA987654322",
              quantity: "1 book",
              isAppeal: false,
              order: 3
            }
          ],
          order: 2
        }
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
          identifierInputs: []
        },
        {
          category: "category-b",
          quantity: 1,
          maxQuantity: 1,
          lastTransactionTime: new Date(latestTransactionTimeMs - 2000),
          identifierInputs: []
        },
        {
          category: "category-c",
          quantity: 1,
          maxQuantity: 1,
          lastTransactionTime: latestTransactionTime,
          identifierInputs: []
        },
        {
          category: "category-d",
          quantity: 1,
          maxQuantity: 1,
          lastTransactionTime: new Date(latestTransactionTimeMs - 3000),
          identifierInputs: []
        }
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
