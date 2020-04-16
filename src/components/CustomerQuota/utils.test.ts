import { formatQuantityText, getCheckoutResultByCategory } from "./utils";
import { PostTransactionResponse } from "../../services/quota";
import { CheckoutResultByCategory } from "./types";

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

describe("transformCheckoutResult", () => {
  it("should return the correct result", () => {
    expect.assertions(1);
    const transactionTime = new Date(2020, 3, 1);
    const checkoutResult: PostTransactionResponse = {
      transactions: [
        {
          transaction: [
            {
              category: "toilet-paper",
              quantity: 0
            },
            {
              category: "chocolate",
              quantity: 5
            }
          ],
          timestamp: transactionTime.getTime()
        },
        {
          transaction: [
            {
              category: "toilet-paper",
              quantity: 1
            },
            {
              category: "chocolate",
              quantity: 3
            }
          ],
          timestamp: transactionTime.getTime()
        }
      ]
    };
    const transformed: CheckoutResultByCategory = [
      {
        category: "toilet-paper",
        quantities: {
          "id-1": 0,
          "id-2": 1
        }
      },
      {
        category: "chocolate",
        quantities: {
          "id-1": 5,
          "id-2": 3
        }
      }
    ];

    expect(
      getCheckoutResultByCategory(["id-1", "id-2"], checkoutResult)
    ).toStrictEqual(transformed);
  });
});
