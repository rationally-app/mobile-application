import { summariseTransactions } from "./utils";
import { CampaignPolicy, DailyStatistics } from "../../types";

describe("summariseTransactions", () => {
  let pastTransactions: DailyStatistics;
  let campaignPolicy: CampaignPolicy[] = [];
  let pastInstantNoodleTransactions: DailyStatistics;
  let invalidPastTransactions: DailyStatistics;

  beforeAll(() => {
    pastTransactions = {
      pastTransactions: [
        {
          category: "instant-noodles",
          quantity: 999,
          transactionTime: 12000000000
        },
        {
          category: "chocolate",
          quantity: 3000,
          transactionTime: 12000000000
        },
        {
          category: "vouchers",
          quantity: 20,
          transactionTime: 12000000000
        }
      ]
    };

    pastInstantNoodleTransactions = {
      pastTransactions: [
        {
          category: "instant-noodles",
          quantity: 999,
          transactionTime: 12000000000
        }
      ]
    };

    invalidPastTransactions = {
      pastTransactions: [
        {
          category: "funny-category",
          quantity: 999,
          transactionTime: 12000000000
        }
      ]
    };

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
            label: " pack(s)"
          }
        }
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
            label: " pack(s)"
          }
        }
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
            label: "$"
          }
        }
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
              text: "Scan"
            }
          },
          {
            label: "Token",
            textInput: { visible: true, disabled: true, type: "STRING" },
            scanButton: {
              visible: true,
              disabled: false,
              type: "QR",
              text: "Scan"
            }
          }
        ]
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
              disabled: false
            }
          }
        ]
      }
    ];
  });

  it("should return multiple summarised transactions categories with total count and count per category and the name to be displayed on the stats page", () => {
    expect.assertions(1);
    expect(
      summariseTransactions(pastTransactions, campaignPolicy)
    ).toStrictEqual({
      summarisedTotalCount: 4019,
      summarisedTransactionHistory: [
        {
          category: "instant-noodles",
          name: "🍜 Instant Noodles",
          quantity: 999
        },
        { category: "chocolate", name: "🍫 Chocolate", quantity: 3000 },
        { category: "vouchers", name: "Funfair Vouchers", quantity: 20 }
      ]
    });
  });

  it("should return single summarised transaction category", () => {
    expect.assertions(1);
    expect(
      summariseTransactions(pastInstantNoodleTransactions, campaignPolicy)
    ).toStrictEqual({
      summarisedTotalCount: 999,
      summarisedTransactionHistory: [
        {
          category: "instant-noodles",
          name: "🍜 Instant Noodles",
          quantity: 999
        }
      ]
    });
  });

  it("should return category with category as name if transacted item is not in policies", () => {
    expect.assertions(1);
    expect(
      summariseTransactions(invalidPastTransactions, campaignPolicy)
    ).toStrictEqual({
      summarisedTotalCount: 999,
      summarisedTransactionHistory: [
        {
          category: "funny-category",
          name: "funny-category",
          quantity: 999
        }
      ]
    });
  });
});
