import { parsePhoneNumber, validatePhoneNumberForCountry } from "./parser";
import Errors from "./errors";

const {
  CountryCodeInvalidError,
  PhoneNumberInvalidForRegionError,
  PhoneNumberTooLongError,
  PhoneNumberTooShortError,
  PhoneNumberUnrecognisedError,
} = Errors;

describe("parsePhoneNumber", () => {
  describe("when phoneNumber starts with `+`", () => {
    describe("should throw PhoneNumberTooShortError when phone number is too short", () => {
      it.each(["+65 8", "+650", "+60 3", "+86 1", "+", "++", "+1", ""])(
        "%p",
        (phoneNumber) => {
          expect.assertions(1);
          expect(() => parsePhoneNumber(phoneNumber)).toThrow(
            PhoneNumberTooShortError
          );
        }
      );
    });

    describe("should throw PhoneNumberTooLongError when phone number is too long", () => {
      it.each([
        "+65 8888 8888 8888 8888 88",
        "+60 3 3333 3333 3333 3333 3",
        "+60333333333333333333",
        "+1333333333333333333",
      ])("%p", (phoneNumber) => {
        expect.assertions(1);
        expect(() => parsePhoneNumber(phoneNumber)).toThrow(
          PhoneNumberTooLongError
        );
      });
    });

    describe("should throw CountryCodeInvalidError when phone number's country code is invalid", () => {
      it.each([
        "+999 8888 8888",
        "+801 8888 8888",
        "+978 8888 8888",
        "+215 8888 8888",
      ])("%p", (phoneNumber) => {
        expect.assertions(1);
        expect(() => parsePhoneNumber(phoneNumber)).toThrow(
          CountryCodeInvalidError
        );
      });
    });

    describe("should throw PhoneNumberUnrecognisedError when phone number cannot be parsed", () => {
      it.each([
        "+asd 8888 8888",
        "+65",
        "+651!2345",
        "+65 asd",
        "+65asd",
        "+861234|   5",
        "+60---",
        "+asdf",
        "+!#86",
        "+++",
      ])("%p", (phoneNumber) => {
        expect.assertions(1);
        expect(() => parsePhoneNumber(phoneNumber)).toThrow(
          PhoneNumberUnrecognisedError
        );
      });
    });

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
      describe("should throw PhoneNumberTooShortError when phone number is too short", () => {
        it.each([
          ["65", ""],
          ["65", "1"],
          ["+65", "01"],
          ["+1", "91"],
          ["60", "32"],
          ["+86", "13"],
        ])("code: %p\tnumber: %p", (countryCode, phoneNumber) => {
          expect.assertions(1);
          expect(() => parsePhoneNumber(phoneNumber, countryCode)).toThrow(
            PhoneNumberTooShortError
          );
        });
      });

      describe("should throw PhoneNumberTooLongError when phone number is too long", () => {
        it.each([
          ["65", "8888 8888 8888 8888 88"],
          ["60", "3 3333 3333 3333 3333 3"],
          ["60", "333333333333333333"],
          ["+1", "333333333333333333"],
        ])("code: %p\t number: %p", (countryCode, phoneNumber) => {
          expect.assertions(1);
          expect(() => parsePhoneNumber(phoneNumber, countryCode)).toThrow(
            PhoneNumberTooLongError
          );
        });
      });

      describe("should throw CountryCodeInvalidError when phone number's country code is invalid", () => {
        it.each([
          ["+999", "8888 8888"],
          ["+801", "8888 8888"],
          ["+978", "8888 8888"],
          ["+215", "8888 8888"],
          ["asd", "8888 8888"],
          ["   ", "8888 8888"],
          ["-1", "8888 8888"],
        ])("code: %p\t number: %p", (countryCode, phoneNumber) => {
          expect.assertions(1);
          expect(() => parsePhoneNumber(phoneNumber, countryCode)).toThrow(
            CountryCodeInvalidError
          );
        });
      });

      describe("should throw PhoneNumberUnrecognisedError when phone number cannot be parsed", () => {
        it.each([
          ["65", "1!2345"],
          ["65", "asd"],
          ["86", "1234|   5"],
          ["60", "----1"],
          ["60", "---"],
        ])("code: %p\t number: %p", (countryCode, phoneNumber) => {
          expect.assertions(1);
          expect(() => parsePhoneNumber(phoneNumber, countryCode)).toThrow(
            PhoneNumberUnrecognisedError
          );
        });
      });

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
            expect(
              parsePhoneNumber(phoneNumber).getCountryCode()
            ).toStrictEqual(65);
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
            ).toStrictEqual(65);
          }
        );
      });
    });
  });
});

describe("validatePhoneNumberForCountry", () => {
  describe("should not throw an error for numbers that are valid for specified country", () => {
    it.each([
      "+65 8888 8888",
      "+65 1800 123 4567",
      "+65 91234567",
      "+1 202-456-1414",
      "+86 167 5558 5558",
      "+86 10 6552 9988",
      "+60 3-2234 1232",
      "+60 82-22 1232",
    ])("%p", (phoneNumber) => {
      expect.assertions(1);
      const parsedNumber = parsePhoneNumber(phoneNumber);
      expect(() => validatePhoneNumberForCountry(parsedNumber)).not.toThrow();
    });
  });

  describe("should throw error for numbers that are invalid for specified country", () => {
    it.each([
      "+65 999",
      "+65 80361234",
      "+86 167 5558 5558 12",
      "+86 167 5558 555",
      "+60 3-1234 1232",
    ])("%p", (phoneNumber) => {
      expect.assertions(1);
      const parsedNumber = parsePhoneNumber(phoneNumber);
      expect(() => validatePhoneNumberForCountry(parsedNumber)).toThrow(
        PhoneNumberInvalidForRegionError
      );
    });
  });
});
