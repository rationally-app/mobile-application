import { PastTransactionsResult, CampaignPolicy } from "../../../types";
import {
  TransactionsByTimeMap,
  groupTransactionsByTime,
  sortTransactionsByTime,
} from "./CheckoutSuccessCard";
import {
  defaultIdentifier,
  defaultTranslationProps,
} from "../../../test/helpers/defaults";
import "../../../common/i18n/i18nMock";

describe("CheckoutSuccessCard utility functions", () => {
  let sortedTransactions: PastTransactionsResult["pastTransactions"];
  let allProducts: CampaignPolicy[];
  let mockTransactionsByTimeMap: TransactionsByTimeMap;

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
