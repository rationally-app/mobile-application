import { PhoneNumberFormat, PhoneNumberUtil } from "google-libphonenumber";

const util = PhoneNumberUtil.getInstance();

export const formatPhoneNumber = (
  phoneNumber: string,
  countryCode = "65"
): string => {
  let region = util.getRegionCodeForCountryCode(Number.parseInt(countryCode));
  // Defaults for when region is invalid
  if (region === "ZZ") {
    region = "SG";
    countryCode = "65";
  }

  phoneNumber = stripPhoneNumberFormatting(phoneNumber);

  try {
    /**
     * Using `PhoneNumberFormat.INTERNATIONAL` because
     * `PhoneNumberFormat.NATIONAL` was padding 0s to the
     * start of the phone number.
     */
    let result = util.format(
      util.parse(phoneNumber, region),
      PhoneNumberFormat.INTERNATIONAL
    );
    const indexOfCountryCode = result.indexOf(countryCode) + countryCode.length;
    result = result.substring(indexOfCountryCode).trim();

    return result;
  } catch (e) {
    return phoneNumber;
  }
};

export const stripPhoneNumberFormatting = (
  formattedPhoneNumber: string
): string => {
  return formattedPhoneNumber.replace(/\D/g, "");
};
