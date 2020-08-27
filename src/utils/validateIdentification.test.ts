import { validateAndCleanId } from "./validateIdentification";
import { EnvVersionError } from "../services/envVersion";

describe("validate and clean IDs", () => {
  it("should return cleaned NRIC if variables are valid", () => {
    expect.assertions(1);
    const idNRICValidation = "NRIC";
    expect(validateAndCleanId("s0000001i", idNRICValidation)).toBe("S0000001I");
  });

  it("should return cleaned alphanumeric ID if variables are valid", () => {
    expect.assertions(1);
    const idRegexValidation = "REGEX";
    const alphanumericRegex = "^[a-zA-Z0-9-_ ]+$";
    expect(
      validateAndCleanId("abcd_1234", idRegexValidation, alphanumericRegex)
    ).toBe("ABCD_1234");
  });
});

describe("throw EnvVersionError", () => {
  it("should throw EnvVersionError if idValidation is missing or undefined", () => {
    expect.assertions(1);
    const undefinedIdValidation = undefined;
    expect(() =>
      validateAndCleanId("100000001", undefinedIdValidation)
    ).toThrow(
      new EnvVersionError(
        "We are currently facing connectivity issues. Try again later or contact your in-charge if the problem persists."
      )
    );
  });

  it("should throw EnvVersionError if validation is REGEX but validationRegex is missing", () => {
    expect.assertions(1);
    const idRegexValidation = "REGEX";
    const undefinedRegex = undefined;
    expect(() =>
      validateAndCleanId("100000001", idRegexValidation, undefinedRegex)
    ).toThrow(
      new EnvVersionError(
        "We are currently facing connectivity issues. Try again later or contact your in-charge if the problem persists."
      )
    );
  });

  it("should throw EnvVersionError if validation is NRIC, but validationRegex exists", () => {
    expect.assertions(1);
    const idNRICValidation = "NRIC";
    const validRegex = "^[a-zA-Z0-9-_ ]+$";
    expect(() =>
      validateAndCleanId("100000001", idNRICValidation, validRegex)
    ).toThrow(
      new EnvVersionError(
        "We are currently facing connectivity issues. Try again later or contact your in-charge if the problem persists."
      )
    );
  });
});
