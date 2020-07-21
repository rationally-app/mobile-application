import { validateAndCleanId } from "./validateIdentification";
import { EnvVersionError } from "../services/envVersion";

describe("throw EnvVersionError", () => {
  it("should throw EnvVersionError if validation is REGEX but validationRegex is missing", () => {
    const idRegexValidation = "REGEX";
    const undefinedRegex = undefined;
    expect.assertions(1);
    expect(() =>
      validateAndCleanId("100000001", idRegexValidation, undefinedRegex)
    ).toThrow(
      new EnvVersionError(
        "Encountered an issue obtaining environment information. We've noted this down and are looking into it!"
      )
    );
  });

  it("should throw EnvVersionError if validation is NRIC, but validationRegex exists", () => {
    const idNRICValidation = "NRIC";
    const validRegex = "^[a-zA-Z0-9-_ ]+$";
    expect.assertions(1);
    expect(() =>
      validateAndCleanId("100000001", idNRICValidation, validRegex)
    ).toThrow(
      new EnvVersionError(
        "Encountered an issue obtaining environment information. We've noted this down and are looking into it!"
      )
    );
  });
});
