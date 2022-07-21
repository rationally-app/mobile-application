import { validate, validateAndCleanRegexInput } from "./validateInputWithRegex";
import "../common/i18n/i18nMock";

const alphanumericRegex = "^[a-zA-Z0-9-_ ]+$";

describe("validate", () => {
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

describe("validateAndCleanRegexInput", () => {
  it("should return uppercased input id and remove trailing and leading whitespaces", () => {
    expect.assertions(4);
    expect(validateAndCleanRegexInput("asd", alphanumericRegex)).toBe("ASD");
    expect(validateAndCleanRegexInput("asDF", alphanumericRegex)).toBe("ASDF");
    expect(
      validateAndCleanRegexInput("              ASD       ", alphanumericRegex)
    ).toBe("ASD");
    expect(validateAndCleanRegexInput("  asDF       ", alphanumericRegex)).toBe(
      "ASDF"
    );
  });

  it("should throw error when the id is invalid", () => {
    expect.assertions(2);
    expect(() => validateAndCleanRegexInput("*asd", alphanumericRegex)).toThrow(
      "Please check that the ID is in the correct format"
    );
    expect(() =>
      validateAndCleanRegexInput("asDF/", alphanumericRegex)
    ).toThrow("Please check that the ID is in the correct format");
  });
});
