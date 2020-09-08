import { toDate } from "date-fns";
import { defaultIdentifier } from "../../../test/helpers/defaults";
import { PastTransactionsResult, CampaignPolicy } from "../../../types";
import {
  groupTransactionsByCategory,
  sortTransactions,
  TransactionsByCategoryMap
} from "./NoQuotaCard";

describe("NoQuotaCard utility functions", () => {
  let sortedTransactions: PastTransactionsResult["pastTransactions"];
  let allProducts: CampaignPolicy[];
  let mockTransactionsByCategoryMap: TransactionsByCategoryMap;

  const latestTransactionTimeMs = 1596530350000;
  const latestTransactionTime = toDate(latestTransactionTimeMs);

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
        transactionTime: toDate(latestTransactionTimeMs - 10000)
      },
      {
        category: "meal-credits",
        quantity: 5,
        transactionTime: toDate(latestTransactionTimeMs - 20000)
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
            transactionDate: "4 Aug 2020, 4:39PM",
            details: "AAA987654321",
            quantity: "1 qty",
            isAppeal: false
          }
        ],
        hasLatestTransaction: true,
        order: 1
      },
      "Meal credits": {
        transactions: [
          {
            transactionDate: "4 Aug 2020, 4:39PM",
            details: "",
            quantity: "$10",
            isAppeal: false
          },
          {
            transactionDate: "4 Aug 2020, 4:38PM",
            details: "",
            quantity: "$5",
            isAppeal: false
          }
        ],
        hasLatestTransaction: true,
        order: 0
      },
      "CDC Vouchers": {
        transactions: [
          {
            transactionDate: "4 Aug 2020, 4:39PM",
            details: "AAA987654322",
            quantity: "1 book",
            isAppeal: false
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
          category: "Meal credits",
          transactions: [
            {
              transactionDate: "4 Aug 2020, 4:39PM",
              details: "",
              quantity: "$10",
              isAppeal: false,
              order: 0
            },
            {
              transactionDate: "4 Aug 2020, 4:38PM",
              details: "",
              quantity: "$5",
              isAppeal: false,
              order: 1
            }
          ],
          order: 0
        },
        {
          category: "TT token",
          transactions: [
            {
              transactionDate: "4 Aug 2020, 4:39PM",
              details: "AAA987654321",
              quantity: "1 qty",
              isAppeal: false,
              order: 2
            }
          ],
          order: 1
        },
        {
          category: "CDC Vouchers",
          transactions: [
            {
              transactionDate: "4 Aug 2020, 4:39PM",
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
});
