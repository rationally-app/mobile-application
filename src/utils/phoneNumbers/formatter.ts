import {
  PhoneNumberFormat,
  PhoneNumberUtil,
  PhoneNumber,
} from "google-libphonenumber";

const phoneUtil = PhoneNumberUtil.getInstance();

/**
 * Formats a phone number in International format
 *
 * International formats it to include spaces and dashes
 * e.g. US standard format: (202) 456-1414, International format: +1 202-456-1414
 * * e.g. SG standard format: 8034 5678, International format: +65 8037 5093
 *
 * @param parsedNumber Number that has been parsed using `parsePhoneNumber`.
 * Note that a parsed number is required to use libphonenumber's format function.
 *
 * @param includeCountryCode defaults to true
 * if false, the country code will be omitted, so only the formatted national
 * phone number will be returned
 */
export const formatPhoneNumberInternational = (
  parsedNumber: PhoneNumber,
  includeCountryCode = true
): string => {
  const formatted = phoneUtil.format(
    parsedNumber,
    PhoneNumberFormat.INTERNATIONAL
  );

  if (!includeCountryCode) {
    const countryCode = `+${parsedNumber.getCountryCodeOrDefault()}`;
    return formatted
      .slice(formatted.indexOf(countryCode) + countryCode.length)
      .trim();
  } else {
    return formatted;
  }
};

/**
 * Formats a countryCode and phoneNumber in E164 format.
 *
 * E164 is an internationally recognised standard that includes the following:
 * - `+` sign
 * - International Country Calling code
 * - Local area code
 * - Local phone number
 * e.g. US standard format: (202) 456-1414, E164 format: +12024561414
 * e.g. SG standard format: 8034 5678, E164 format: +6580345678
 *
 * Note that this function merely concatenates the countryCode and phoneNumber,
 * no area codes are supported.
 *
 * @param countryCode `+` prefix is optional
 * @param phoneNumber Phone numbers formatted in standard or international formats are accepted
 */
export const formatPhoneNumberE164 = (
  countryCode: string,
  phoneNumber: string
): string => {
  const strippedCountryCode = stripNonDigits(countryCode);
  const strippedPhoneNumber = stripNonDigits(phoneNumber);
  return `+${strippedCountryCode}${strippedPhoneNumber}`;
};

/**
 * Removes all non-digit characters
 *
 * @param text
 */
export const stripNonDigits = (text: string): string => text.replace(/\D/g, "");
