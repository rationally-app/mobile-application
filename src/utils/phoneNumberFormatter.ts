import { PhoneNumberFormat, PhoneNumberUtil } from "google-libphonenumber";

const util = PhoneNumberUtil.getInstance();

export const formatPhoneNumber = (
  phoneNumber: string,
  countryCode = "65"
): string => {
  let region = util.getRegionCodeForCountryCode(Number.parseInt(countryCode));
  region = region === "ZZ" ? "SG" : region;

  const exampleNumber = util
    .getExampleNumber(region)
    .getNationalNumberOrDefault()
    .toString();

  phoneNumber = stripPhoneNumberFormatting(phoneNumber);
  phoneNumber =
    phoneNumber.length > exampleNumber.length
      ? phoneNumber.substring(0, exampleNumber.length)
      : phoneNumber;

  if (phoneNumber.length === exampleNumber.length) {
    try {
      return util.format(
        util.parse(phoneNumber, region),
        PhoneNumberFormat.NATIONAL
      );
    } catch (e) {
      return phoneNumber;
    }
  }

  return phoneNumber;
};

export const stripPhoneNumberFormatting = (
  formattedPhoneNumber: string
): string => {
  return formattedPhoneNumber.replace(/\D/g, "");
};
