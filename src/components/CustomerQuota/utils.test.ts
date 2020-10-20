import { formatQuantityText, sortTransactionsByOrder } from "./utils";

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
    expect(arr.sort(sortTransactionsByOrder)).toStrictEqual([
      { order: 0, anotherField: "nah" },
      { order: 1, someField: "right" },
      { order: 2, someField: "ok", someOtherField: "yeah" },
    ]);
  });
});
