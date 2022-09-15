import {
  createFullNumber,
  mobileNumberValidator,
  countryCodeValidator,
  fullPhoneNumberValidator,
  parsePhoneNumber,
} from "./validatePhoneNumbers";

describe("createFullNumber", () => {
  it("should combine the 2 params properly to create a full phone number without spaces", () => {
    expect.assertions(3);
    expect(createFullNumber("+65", "98765432")).toBe("+6598765432");
    expect(createFullNumber("+6 5", "98765432")).toBe("+6598765432");
    expect(createFullNumber("+65", "987654 32")).toBe("+6598765432");
  });
});

describe("parsePhoneNumber", () => {
  describe("when phoneNumber starts with `+`", () => {
    describe("should not throw any error when phone number is valid", () => {
      it.each([
        "+65 8888 8888",
        "+65 88888888",
        "+6588888888",
        "+65  88888 - - 888",
        "+65  88888 - * 888",
        "+65 9123 4567",
        "+65 8038 4567",
        "+65 999",
        "+65 80", // Doesn't check if it's a legit number
        "+60 300",
        "+1 2024561414",
      ])("%p", (phoneNumber) => {
        expect.assertions(1);
        expect(() => parsePhoneNumber(phoneNumber)).not.toThrow();
      });
    });
  });

  describe("when phoneNumber does not start with `+`", () => {
    describe("when countryCode is specified", () => {
      describe("should not throw any error when phone number is valid", () => {
        it.each([
          ["65", "8888 8888"],
          ["65", "88888888"],
          ["65", "  88888888"],
          ["+65", "  88888 - - 888"],
          ["65", "  88888 - * 888"],
          ["65", "  88888 - /*() 888"],
          ["+65", "9123 4567"],
          ["65", "8038 4567"],
          ["65", "999"],
          ["65", "800"], // Doesn't check if it's a legit number
          ["60", "300"],
          ["1", "2024561414"],
        ])("code: %p\t number: %p", (countryCode, phoneNumber) => {
          expect.assertions(1);
          expect(() =>
            parsePhoneNumber(phoneNumber, countryCode)
          ).not.toThrow();
        });
      });
    });

    describe("when countryCode is not specified", () => {
      describe("should parse the number as a +65 number", () => {
        it.each(["8888 8888", "1234", "999", "2024561414"])(
          "%p",
          (phoneNumber) => {
            expect.assertions(2);
            expect(() => parsePhoneNumber(phoneNumber)).not.toThrow();
            expect(parsePhoneNumber(phoneNumber).getCountryCode()).toBe(65);
          }
        );

        it.each([undefined, ""])(
          "should work for falsy countryCode value: %p",
          (countryCode) => {
            expect.assertions(2);
            const phoneNumber = "8888 8888";
            expect(() =>
              parsePhoneNumber(phoneNumber, countryCode)
            ).not.toThrow();
            expect(
              parsePhoneNumber(phoneNumber, countryCode).getCountryCode()
            ).toBe(65);
          }
        );
      });
    });
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
    expect.assertions(4);
    expect(mobileNumberValidator("+65", "96247612")).toBe(true);
    expect(mobileNumberValidator("+65", "98261749")).toBe(true);
    expect(mobileNumberValidator("+65", "98219374")).toBe(true);
    expect(mobileNumberValidator("+65", "80230000")).toBe(true);
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
    expect.assertions(12);
    expect(fullPhoneNumberValidator("+659")).toBe(false);
    expect(fullPhoneNumberValidator("+191234567")).toBe(false);

    expect(fullPhoneNumberValidator("+658234567890")).toBe(false);
    expect(fullPhoneNumberValidator("+659234567")).toBe(false);

    expect(fullPhoneNumberValidator("+6502345678")).toBe(false);
    expect(fullPhoneNumberValidator("+6512345678")).toBe(false);
    expect(fullPhoneNumberValidator("+6522345678")).toBe(false);
    expect(fullPhoneNumberValidator("+6542345678")).toBe(false);
    expect(fullPhoneNumberValidator("+6552345678")).toBe(false);
    expect(fullPhoneNumberValidator("+6572345678")).toBe(false);

    expect(fullPhoneNumberValidator("+65!@#$%^&*")).toBe(false);
    expect(fullPhoneNumberValidator("+65😋😋😋😋😋")).toBe(false);
  });

  it("should return true for valid phone numbers", () => {
    expect.assertions(12);
    expect(fullPhoneNumberValidator("+6596247612")).toBe(true);
    expect(fullPhoneNumberValidator("+6598261749")).toBe(true);
    expect(fullPhoneNumberValidator("+6598219374")).toBe(true);
    expect(fullPhoneNumberValidator("+6580230000")).toBe(true);

    expect(fullPhoneNumberValidator("+6581111111")).toBe(true);
    expect(fullPhoneNumberValidator("+6581221222")).toBe(true);
    expect(fullPhoneNumberValidator("+6591111111")).toBe(true);
    expect(fullPhoneNumberValidator("+6591222122")).toBe(true);

    expect(fullPhoneNumberValidator("+6530230000")).toBe(true);
    expect(fullPhoneNumberValidator("+6530230000")).toBe(true);
    expect(fullPhoneNumberValidator("+6560230000")).toBe(true);
    expect(fullPhoneNumberValidator("+6560230000")).toBe(true);
  });
});
