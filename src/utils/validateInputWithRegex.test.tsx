import { validate, validateAndCleanId } from "./validateInputWithRegex";
import { EnvVersionError } from "../services/envVersion";
import * as Sentry from "sentry-expo";

jest.mock("sentry-expo");
const mockCaptureException = jest.fn();
(Sentry.captureException as jest.Mock).mockImplementation(mockCaptureException);

describe("validate", () => {
  const alphanumericRegex = "^[a-zA-Z0-9-_ ]+$";
  it("should return true for alphanumeric regex", () => {
    expect.assertions(2);
    expect(validate("100000001", alphanumericRegex)).toBe(true);
    expect(validate("202006171", alphanumericRegex)).toBe(true);
  });

  it("should return false for invalid alphanumeric regex", () => {
    expect.assertions(3);
    expect(validate("", alphanumericRegex)).toBe(false);
    expect(validate("123123/", alphanumericRegex)).toBe(false);
    expect(validate("abc/", alphanumericRegex)).toBe(false);
  });
});

describe("throw EnvVersionError", () => {
  const undefinedRegex = undefined;
  it("should throw EnvVersionError if validationRegex is missing", () => {
    expect.assertions(1);
    expect(() => validateAndCleanId("100000001", undefinedRegex)).toThrow(
      new EnvVersionError(
        "Encountered an issue obtaining environment information. We've noted this down and are looking into it!"
      )
    );
  });
});
