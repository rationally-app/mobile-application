import { countTotalTransactionsAndByCategory } from "./utils";
import { CampaignPolicy, DailyStatistics } from "../../types";
import { i18ntWithValidator } from "../useTranslate/useTranslate";

describe("countTotalTransactionsAndByCategory", () => {
  let pastTransactions: DailyStatistics[];
  let campaignPolicy: CampaignPolicy[] = [];
  let pastInstantNoodleTransactions: DailyStatistics[];
  let invalidPastTransactions: DailyStatistics[];
  let pastTransactionsWithAppeal: DailyStatistics[];

  beforeAll(() => {
    pastTransactions = [
      {
        category: "instant-noodles",
        quantity: 999,
        transactionTime: new Date(12000000000),
      },
      {
        category: "chocolate",
        quantity: 3000,
        transactionTime: new Date(12000000000),
      },
      {
        category: "vouchers",
        quantity: 20,
        transactionTime: new Date(12000000000),
      },
    ];

    pastInstantNoodleTransactions = [
      {
        category: "instant-noodles",
        quantity: 999,
        transactionTime: new Date(12000000000),
      },
    ];

    invalidPastTransactions = [
      {
        category: "funny-category",
        quantity: 999,
        transactionTime: new Date(12000000000),
      },
    ];

    pastTransactionsWithAppeal = [
      {
        category: "appeal-product",
        quantity: 200,
        transactionTime: new Date(12000000000),
      },
    ];

    campaignPolicy = [
      {
        category: "toilet-paper",
        name: "🧻 Toilet Paper",
        description: "1 ply / 2 ply / 3 ply",
        order: 1,
        type: "REDEEM",
        quantity: {
          period: 7,
          limit: 2,
          unit: {
            type: "POSTFIX",
            label: " pack(s)",
          },
        },
      },
      {
        category: "instant-noodles",
        name: "🍜 Instant Noodles",
        description: "Indomee",
        order: 2,
        type: "REDEEM",
        quantity: {
          period: 30,
          limit: 1,
          unit: {
            type: "POSTFIX",
            label: " pack(s)",
          },
        },
      },
      {
        category: "chocolate",
        name: "🍫 Chocolate",
        description: "Dark / White / Assorted",
        order: 3,
        type: "REDEEM",
        quantity: {
          period: 14,
          limit: 30,
          step: 5,
          unit: {
            type: "PREFIX",
            label: "$",
          },
        },
      },
      {
        category: "vouchers",
        name: "Funfair Vouchers",
        order: 4,
        type: "REDEEM",
        quantity: { period: 1, limit: 1, default: 1 },
        identifiers: [
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
        ],
      },
      {
        category: "voucher",
        name: "🎟️ Golden Ticket",
        order: 5,
        type: "REDEEM",
        quantity: { period: 1, limit: 1, default: 1 },
        identifiers: [
          {
            label: "Phone number",
            textInput: { visible: true, disabled: true, type: "PHONE_NUMBER" },
            scanButton: {
              visible: false,
              disabled: false,
            },
          },
        ],
      },
      {
        category: "appeal-product",
        name: "This Product is for Appeal",
        order: 6,
        type: "REDEEM",
        categoryType: "APPEAL",
        quantity: { period: 1, limit: 1, default: 1 },
      },
    ];
  });

  it("should return multiple summarised transactions categories with total count and count per category and the name to be displayed on the stats page, as well as ordered by ascending order number", () => {
    expect.assertions(1);
    expect(
      countTotalTransactionsAndByCategory(pastTransactions, campaignPolicy)
    ).toStrictEqual({
      summarisedTotalCount: 4019,
      summarisedTransactionHistory: [
        {
          category: "instant-noodles",
          name: "🍜 Instant Noodles",
          quantityText: "999 pack(s)",
          descriptionAlert: undefined,
          order: 2,
        },
        {
          category: "chocolate",
          name: "🍫 Chocolate",
          quantityText: "$3,000",
          descriptionAlert: undefined,
          order: 3,
        },
        {
          category: "vouchers",
          name: "Funfair Vouchers",
          quantityText: "20 qty",
          descriptionAlert: undefined,
          order: 4,
        },
      ],
    });
  });

  it("should return single summarised transaction category", () => {
    expect.assertions(1);
    expect(
      countTotalTransactionsAndByCategory(
        pastInstantNoodleTransactions,
        campaignPolicy
      )
    ).toStrictEqual({
      summarisedTotalCount: 999,
      summarisedTransactionHistory: [
        {
          category: "instant-noodles",
          name: "🍜 Instant Noodles",
          quantityText: "999 pack(s)",
          descriptionAlert: undefined,
          order: 2,
        },
      ],
    });
  });

  it("should return category with category as name if transacted item is not in policies", () => {
    expect.assertions(1);
    expect(
      countTotalTransactionsAndByCategory(
        invalidPastTransactions,
        campaignPolicy
      )
    ).toStrictEqual({
      summarisedTotalCount: 999,
      summarisedTransactionHistory: [
        {
          category: "funny-category",
          name: "funny-category",
          quantityText: "999 qty",
          descriptionAlert: undefined,
          order: -1,
        },
      ],
    });
  });

  it("should have appeal alertDescription 'via appeal' if product is from an appeal flow", () => {
    expect.assertions(1);
    expect(
      countTotalTransactionsAndByCategory(
        pastTransactionsWithAppeal,
        campaignPolicy
      )
    ).toStrictEqual({
      summarisedTotalCount: 200,
      summarisedTransactionHistory: [
        {
          category: "appeal-product",
          name: "This Product is for Appeal",
          quantityText: "200 qty",
          descriptionAlert: i18ntWithValidator("redemptionStats", "viaAppeal"),
          order: 6,
        },
      ],
    });
  });
});
