import { validateMerchantCode } from "./validateMerchantCode";

describe("validate merchant code", () => {
  it("should return true for valid merchant code", () => {
    expect.assertions(2);
    expect(validateMerchantCode("100000001")).toBe(true);
    expect(validateMerchantCode("202006171")).toBe(true);
  });

  it("should return false for invalid merchant code", () => {
    expect.assertions(3);
    expect(validateMerchantCode("")).toBe(false);
    expect(validateMerchantCode("007")).toBe(false);
    expect(validateMerchantCode("2020061711")).toBe(false);
  });
});
