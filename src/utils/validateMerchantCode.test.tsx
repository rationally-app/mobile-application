import { validateMerchantCode } from "./validateMerchantCode";

describe("validate merchant code", () => {
  it("should return true for valid merchant code", () => {
    expect.assertions(11);
    expect(validateMerchantCode("12345678")).toBe(true);
    expect(validateMerchantCode("123")).toBe(true);
    expect(validateMerchantCode("1")).toBe(true);
    expect(validateMerchantCode("ABCDEFGH")).toBe(true);
    expect(validateMerchantCode("ABC")).toBe(true);
    expect(validateMerchantCode("A")).toBe(true);
    expect(validateMerchantCode("ABCD1234")).toBe(true);
    expect(validateMerchantCode("A12")).toBe(true);
    expect(validateMerchantCode("123ABC")).toBe(true);
    expect(validateMerchantCode("abc")).toBe(true);
    expect(validateMerchantCode("123abcDE")).toBe(true);
  });

  it("should return false for invalid merchant code", () => {
    expect.assertions(6);
    const errorMessage = "Invalid merchant code";
    expect(() => validateMerchantCode("")).toThrow(errorMessage);
    expect(() => validateMerchantCode("() => {}")).toThrow(errorMessage);
    expect(() => validateMerchantCode("<script></script>")).toThrow(
      errorMessage
    );
    expect(() => validateMerchantCode("å∫ç∂´ƒ©˙")).toThrow(errorMessage);
    expect(() => validateMerchantCode("ABCD12345678")).toThrow(errorMessage);
    expect(() => validateMerchantCode("ABCD12345")).toThrow(errorMessage);
  });
});
