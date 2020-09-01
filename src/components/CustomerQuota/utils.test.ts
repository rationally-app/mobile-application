import {
  formatQuantityText,
  getPurchasedQuantitiesByItem,
  sortObjectsByHeaderAsc
} from "./utils";
import { CheckoutQuantitiesByItem } from "./types";
import { PostTransactionResult } from "../../types";

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

describe("getPurchasedQuantitiesByItem", () => {
  it("should return the correct result", () => {
    expect.assertions(1);
    const transactionTime = new Date(2020, 3, 1);
    const checkoutResult: PostTransactionResult = {
      transactions: [
        {
          transaction: [
            {
              category: "toilet-paper",
              quantity: 0,
              identifierInputs: []
            },
            {
              category: "chocolate",
              quantity: 5,
              identifierInputs: []
            }
          ],
          timestamp: transactionTime
        },
        {
          transaction: [
            {
              category: "toilet-paper",
              quantity: 1,
              identifierInputs: []
            },
            {
              category: "chocolate",
              quantity: 3,
              identifierInputs: []
            }
          ],
          timestamp: transactionTime
        }
      ]
    };
    const transformed: CheckoutQuantitiesByItem = [
      {
        category: "toilet-paper",
        quantities: {
          "id-1": 0,
          "id-2": 1
        },
        identifierInputs: []
      },
      {
        category: "chocolate",
        quantities: {
          "id-1": 5,
          "id-2": 3
        },
        identifierInputs: []
      }
    ];

    expect(
      getPurchasedQuantitiesByItem(["id-1", "id-2"], checkoutResult)
    ).toStrictEqual(transformed);
  });
});

describe("sortObjectsByHeaderAsc", () => {
  it("should sort objects by header field in ascending order", () => {
    const arr = [
      { header: "wow", someField: "ok", someOtherField: "yeah" },
      { header: "but", anotherField: "nah" },
      { header: "hmm", someField: "right" }
    ];
    expect(arr.sort(sortObjectsByHeaderAsc)).toEqual([
      { header: "but", anotherField: "nah" },
      { header: "hmm", someField: "right" },
      { header: "wow", someField: "ok", someOtherField: "yeah" }
    ]);
  });
});
