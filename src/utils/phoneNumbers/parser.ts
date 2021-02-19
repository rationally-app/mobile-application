import { PhoneNumberUtil, PhoneNumber } from "google-libphonenumber";
import Errors from "./errors";

const phoneUtil = PhoneNumberUtil.getInstance();

const DEFAULT_COUNTRY_CODE = "+65";

/**
 * Wrapper on libphonenumber's parse that throws errors that are recognised
 */
const _parse = (number: string, region?: string): PhoneNumber => {
  try {
    return phoneUtil.parse(number, region);
  } catch (e) {
    switch (e.message) {
      case "The string supplied is too short to be a phone number":
        throw new Errors.PhoneNumberTooShortError(
          "The string supplied is too short to be a phone number"
        );
      case "The string supplied is too long to be a phone number":
        throw new Errors.PhoneNumberTooLongError(
          "The string supplied is too long to be a phone number"
        );
      case "Invalid country calling code":
        throw new Errors.CountryCodeInvalidError(
          "Invalid country calling code"
        );
      case "The string supplied did not seem to be a phone number":
      default:
        throw new Errors.PhoneNumberUnrecognisedError(
          "The string supplied did not seem to be a phone number"
        );
    }
  }
};

/**
 * Parses a given number. Does not check if the number is valid for
 * the particular country.
 *
 * @param phoneNumber
 * A string that may or may not start with `+`.
 * Should consist only of numbers or `+`.
 *
 * @param countryCode
 * Should be specified if phoneNumber does not start with `+`.
 * If unspecified, will default to +65.
 */
export const parsePhoneNumber = (
  phoneNumber: string,
  countryCode?: string
): PhoneNumber => {
  // 1st pass length check
  if (phoneNumber.replace(/\s/g, "").length <= 2) {
    throw new Errors.PhoneNumberTooShortError(
      "The string supplied is too short to be a phone number"
    );
  }
  if (phoneNumber.startsWith("+")) {
    return _parse(phoneNumber);
  } else {
    return _parse(
      phoneNumber,
      phoneUtil.getRegionCodeForCountryCode(
        Number.parseInt(countryCode || DEFAULT_COUNTRY_CODE) // Using OR operator to support fallbacks for blank countryCodes
      )
    );
  }
};

/**
 * Throws if a parsed number is invalid for its country code
 *
 * @param parsedNumber Number that has been parsed using `parsePhoneNumber`
 */
export const validatePhoneNumberForCountry = (
  parsedNumber: PhoneNumber
): void => {
  const regionCode = phoneUtil.getRegionCodeForNumber(parsedNumber);
  if (!phoneUtil.isValidNumberForRegion(parsedNumber, regionCode)) {
    throw new Errors.PhoneNumberInvalidForRegionError(
      "The phone number is invalid for the specified region"
    );
  }
};
