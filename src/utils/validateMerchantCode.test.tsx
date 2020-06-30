import { validateMerchantCode } from "./validateMerchantCode";

describe("validate merchant code", () => {
  it("should return true for valid merchant code", () => {
    expect.assertions(5);
    expect(validateMerchantCode("100000001")).toBe(true);
    expect(validateMerchantCode("202006171")).toBe(true);
    expect(validateMerchantCode("merchant code")).toBe(true);
    expect(validateMerchantCode("merchant-code-a123")).toBe(true);
    expect(validateMerchantCode("merchant_code_a123")).toBe(true);
  });

  it("should return false for invalid merchant code", () => {
    expect.assertions(4);
    expect(() => validateMerchantCode("")).toThrow("Invalid merchant code");
    expect(() => validateMerchantCode("() => {}")).toThrow(
      "Invalid merchant code"
    );
    expect(() => validateMerchantCode("<script></script>")).toThrow(
      "Invalid merchant code"
    );
    expect(() => validateMerchantCode("å∫ç∂´ƒ©˙")).toThrow(
      "Invalid merchant code"
    );
  });
});
