import { validate, checkDuplicate } from "./validateVoucherCode";

describe("validate", () => {
  it("should return true for valid voucher code", () => {
    expect.assertions(2);
    expect(validate("100000001")).toBe(true);
    expect(validate("202006171")).toBe(true);
  });

  it("should return false for invalid voucher code", () => {
    expect.assertions(3);
    expect(validate("")).toBe(false);
    expect(validate("007")).toBe(false);
    expect(validate("2020061711")).toBe(false);
  });
});

describe("check duplicate", () => {
  it("should return true for duplicate voucher code", () => {
    expect.assertions(1);
    expect(checkDuplicate("100000001", ["100000001", "202006171"])).toBe(true);
  });

  it("should return false for unique voucher codes", () => {
    expect.assertions(1);
    expect(checkDuplicate("100000001", ["100000002", "202006171"])).toBe(false);
  });
});
