import { formatQuantityText, sortObjectsByHeaderAsc } from "./utils";

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

describe("sortObjectsByHeaderAsc", () => {
  it("should sort objects by header field in ascending order", () => {
    expect.assertions(1);
    const arr = [
      { header: "wow", someField: "ok", someOtherField: "yeah" },
      { header: "but", anotherField: "nah" },
      { header: "hmm", someField: "right" }
    ];
    expect(arr.sort(sortObjectsByHeaderAsc)).toStrictEqual([
      { header: "but", anotherField: "nah" },
      { header: "hmm", someField: "right" },
      { header: "wow", someField: "ok", someOtherField: "yeah" }
    ]);
  });
});
