import {
  formatPhoneNumberInternational,
  formatPhoneNumberE164,
  stripNonDigits,
} from "./formatter";
import { parsePhoneNumber } from "./parser";

const numbersAbleToBeFormattedNicely = [
  // International, International without country code, E164, E164 without country code
  ["+65 8888 8888", "8888 8888", "+6588888888", "88888888"],
  ["+65 1800 123 4567", "1800 123 4567", "+6518001234567", "18001234567"],
  ["+65 9123 4567", "9123 4567", "+6591234567", "91234567"],
  ["+1 202-456-1414", "202-456-1414", "+12024561414", "2024561414"],
  ["+86 167 5558 5558", "167 5558 5558", "+8616755585558", "16755585558"],
  ["+86 10 6552 9988", "10 6552 9988", "+861065529988", "1065529988"],
  ["+60 3-2234 1232", "3-2234 1232", "+60322341232", "322341232"],
  ["+60 82-221 232", "82-221 232", "+6082221232", "82221232"],
];

const numbersUnableToBeFormattedNicely = [
  // International, International without country code, E164, E164 without country code
  ["+65 888888889", "888888889", "+65888888889", "888888889"],
  ["+65 180012345678", "180012345678", "+65180012345678", "180012345678"],
  ["+65 9123456", "9123456", "+659123456", "9123456"],
  ["+1 20245614142", "20245614142", "+120245614142", "20245614142"],
  ["+86 1675558555", "1675558555", "+861675558555", "1675558555"],
  ["+86 10655299889", "10655299889", "+8610655299889", "10655299889"],
  ["+60 3223412324", "3223412324", "+603223412324", "3223412324"],
  ["+60 8222123", "8222123", "+608222123", "8222123"],
];

describe("formatPhoneNumberInternational", () => {
  describe("International formatting", () => {
    describe("when includeCountryCode is undefined", () => {
      describe("when phone numbers can be formatted nicely", () => {
        const numbers = numbersAbleToBeFormattedNicely.map((r) => [r[2], r[0]]);
        it.each(numbers)("%p \t %p", (phoneNumber, expectedFormattedNumber) => {
          expect.assertions(1);
          const parsedNumber = parsePhoneNumber(phoneNumber);
          expect(formatPhoneNumberInternational(parsedNumber)).toStrictEqual(
            expectedFormattedNumber
          );
        });
      });

      describe("when phone numbers cannot be formatted nicely", () => {
        const numbers = numbersUnableToBeFormattedNicely.map((r) => [
          r[2],
          r[0],
        ]);
        it.each(numbers)("%p \t %p", (phoneNumber, expectedFormattedNumber) => {
          expect.assertions(1);
          const parsedNumber = parsePhoneNumber(phoneNumber);
          expect(formatPhoneNumberInternational(parsedNumber)).toStrictEqual(
            expectedFormattedNumber
          );
        });
      });
    });

    describe("when includeCountryCode is false", () => {
      describe("when phone numbers can be formatted nicely", () => {
        const numbers = numbersAbleToBeFormattedNicely.map((r) => [r[2], r[1]]);
        it.each(numbers)("%p \t %p", (phoneNumber, expectedFormattedNumber) => {
          expect.assertions(1);
          const parsedNumber = parsePhoneNumber(phoneNumber);
          expect(
            formatPhoneNumberInternational(parsedNumber, false)
          ).toStrictEqual(expectedFormattedNumber);
        });
      });

      describe("when phone numbers cannot be formatted nicely", () => {
        const numbers = numbersUnableToBeFormattedNicely.map((r) => [
          r[2],
          r[1],
        ]);
        it.each(numbers)("%p \t %p", (phoneNumber, expectedFormattedNumber) => {
          expect.assertions(1);
          const parsedNumber = parsePhoneNumber(phoneNumber);
          expect(
            formatPhoneNumberInternational(parsedNumber, false)
          ).toStrictEqual(expectedFormattedNumber);
        });
      });
    });
  });
});

describe("formatPhoneNumberE164", () => {
  describe("E164 formatting", () => {
    const numbers = numbersAbleToBeFormattedNicely.map((r) => [r[0], r[2]]);
    it.each(numbers)("%p \t %p", (phoneNumber, expectedFormattedNumber) => {
      expect.assertions(1);
      // TODO: figure out how to test this with national numbers while keeping the "db" of phone numbers constant
      // const parsedNumber = parsePhoneNumber(phoneNumber);
      expect(formatPhoneNumberE164(phoneNumber, "")).toStrictEqual(
        expectedFormattedNumber
      );
    });
  });
});

describe("stripNonDigits", () => {
  describe("should remove all non-digits", () => {
    it.each([
      ["+1 202-456-1414", "12024561414"],
      ["202-456-1414", "2024561414"],
      ["(202) 456-1414", "2024561414"],
      ["+60 3-2234 1232", "60322341232"],
    ])("%p \t %p", (phoneNumber, expectedPhoneNumber) => {
      expect.assertions(1);
      expect(stripNonDigits(phoneNumber)).toStrictEqual(expectedPhoneNumber);
    });
  });
});
