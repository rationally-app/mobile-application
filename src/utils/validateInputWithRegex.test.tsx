import { validate, validateAndCleanRegexInput } from "./validateInputWithRegex";
import { EnvVersionError } from "../services/envVersion";

describe("validate", () => {
  const alphanumericRegex = "^[a-zA-Z0-9-_ ]+$";
  it("should return true for alphanumeric regex", () => {
    expect.assertions(4);
    expect(validate("100000001", alphanumericRegex)).toBe(true);
    expect(validate("1234-ABCD", alphanumericRegex)).toBe(true);
    expect(validate("ABCD_1234", alphanumericRegex)).toBe(true);
    expect(validate("ABCD 1234", alphanumericRegex)).toBe(true);
  });

  it("should return false for invalid alphanumeric regex", () => {
    expect.assertions(3);
    expect(validate("", alphanumericRegex)).toBe(false);
    expect(validate("123abc/", alphanumericRegex)).toBe(false);
    expect(validate("123abc!", alphanumericRegex)).toBe(false);
  });
});

describe("throw EnvVersionError", () => {
  const undefinedRegex = undefined;
  it("should throw EnvVersionError if validationRegex is missing", () => {
    expect.assertions(1);
    expect(() =>
      validateAndCleanRegexInput("100000001", undefinedRegex)
    ).toThrow(
      new EnvVersionError(
        "Encountered an issue obtaining environment information. We've noted this down and are looking into it!"
      )
    );
  });
});
