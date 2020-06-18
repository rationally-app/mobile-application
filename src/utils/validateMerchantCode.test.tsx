import { validateMerchantCode } from "./validateMerchantCode";

describe("validate merchant code", () => {
  it("should return true for valid merchant code", () => {
    expect.assertions(2);
    expect(validateMerchantCode("100000001")).toBe(true);
    expect(validateMerchantCode("202006171")).toBe(true);
  });

  it("should return false for invalid merchant code", () => {
    expect.assertions(4);
    expect(() => validateMerchantCode("")).toThrow("Invalid merchant code");
    expect(() => validateMerchantCode("007")).toThrow("Invalid merchant code");
    expect(() => validateMerchantCode("A123456789")).toThrow(
      "Invalid merchant code"
    );
    expect(() => validateMerchantCode("202A0C1D11")).toThrow(
      "Invalid merchant code"
    );
  });
});
