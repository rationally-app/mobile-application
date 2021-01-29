import { PhoneNumberUtil, PhoneNumber } from "google-libphonenumber";

const DEFAULT_COUNTRY_CODE = "+65";

export const createFullNumber = (countryCode: string, number: string): string =>
  `${countryCode}${number}`.replace(/\s/g, "");

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
  const phoneNumberUtil = new PhoneNumberUtil();
  if (phoneNumber.startsWith("+")) {
    return phoneNumberUtil.parse(phoneNumber);
  } else {
    return phoneNumberUtil.parse(
      phoneNumber,
      phoneNumberUtil.getRegionCodeForCountryCode(
        Number.parseInt(countryCode || DEFAULT_COUNTRY_CODE) // Using OR operator to support fallbacks for blank countryCodes
      )
    );
  }
};

export const fullPhoneNumberValidator = (fullNumber: string): boolean => {
  try {
    const phoneNumberUtil = new PhoneNumberUtil();
    const parsedNumber = phoneNumberUtil.parse(fullNumber);
    const regionCode = phoneNumberUtil.getRegionCodeForNumber(parsedNumber);
    return phoneNumberUtil.isValidNumberForRegion(parsedNumber, regionCode);
  } catch (error) {
    return false;
  }
};

export const mobileNumberValidator = (
  countryCode: string,
  number: string
): boolean => {
  if (!/^\d*$/.test(number) || number.length <= 1) {
    return false;
  }
  return fullPhoneNumberValidator(createFullNumber(countryCode, number));
};

export const countryCodeValidator = (code: string): boolean => {
  const phoneNumberUtil = new PhoneNumberUtil();
  const regions = phoneNumberUtil.getSupportedRegions();
  const countryCodesList = regions.map((region) =>
    phoneNumberUtil.getCountryCodeForRegion(region).toString()
  );
  return code[0] === "+" && countryCodesList.includes(code.substring(1));
};
