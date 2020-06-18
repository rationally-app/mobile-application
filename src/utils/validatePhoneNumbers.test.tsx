import {
  createFullNumber,
  mobileNumberValidator,
  countryCodeValidator,
  fullPhoneNumberValidator,
  validatePhoneNumbers
} from "./validatePhoneNumbers";

describe("createFullNumber", () => {
  it("should combine the 2 params properly to create a full phone number without spaces", () => {
    expect.assertions(3);
    expect(createFullNumber("+65", "98765432")).toBe("+6598765432");
    expect(createFullNumber("+6 5", "98765432")).toBe("+6598765432");
    expect(createFullNumber("+65", "987654 32")).toBe("+6598765432");
  });
});

describe("mobileNumberValidator", () => {
  it("should return false for invalid numbers", () => {
    expect.assertions(7);
    expect(mobileNumberValidator("+65", "12345678")).toBe(false);
    expect(mobileNumberValidator("+65", "1")).toBe(false);
    expect(mobileNumberValidator("+65", "12")).toBe(false);
    expect(mobileNumberValidator("+1", "91234567")).toBe(false);
    expect(mobileNumberValidator("+65", " ")).toBe(false);
    expect(mobileNumberValidator("+65", "")).toBe(false);
    expect(mobileNumberValidator("+1", "asicdbaoisb")).toBe(false);
  });

  it("should return true for valid numbers", () => {
    expect.assertions(3);
    expect(mobileNumberValidator("+65", "96247612")).toBe(true);
    expect(mobileNumberValidator("+65", "98261749")).toBe(true);
    expect(mobileNumberValidator("+65", "98219374")).toBe(true);
  });
});

describe("countryCodeValidator", () => {
  it("should return false for invalid country codes", () => {
    expect.assertions(2);
    expect(countryCodeValidator("65")).toBe(false);
    expect(countryCodeValidator("+900")).toBe(false);
  });

  it("should return true for valid country codes", () => {
    expect.assertions(4);
    expect(countryCodeValidator("+65")).toBe(true);
    expect(countryCodeValidator("+1")).toBe(true);
    expect(countryCodeValidator("+61")).toBe(true);
    expect(countryCodeValidator("+370")).toBe(true);
  });
});

describe("fullPhoneNumberValidator", () => {
  it("should return false for invalid phone numbers", () => {
    expect.assertions(2);
    expect(fullPhoneNumberValidator("+659")).toBe(false);
    expect(fullPhoneNumberValidator("+191234567")).toBe(false);
  });

  it("should return true for valid phone numbers", () => {
    expect.assertions(3);
    expect(fullPhoneNumberValidator("+6596247612")).toBe(true);
    expect(fullPhoneNumberValidator("+6598261749")).toBe(true);
    expect(fullPhoneNumberValidator("+6598219374")).toBe(true);
  });
});

describe("validatePhoneNumbers", () => {
  it("should return false if there is an invalid phone number", () => {
    expect.assertions(1);
    expect(validatePhoneNumbers(["+659", "+6596247612"])).toBe(false);
  });

  it("should return true for valid phone numbers", () => {
    expect.assertions(1);
    expect(
      validatePhoneNumbers(["+6596247612", "+6598261749", "+6598219374"])
    ).toBe(true);
  });
});
