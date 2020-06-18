import { PhoneNumberUtil } from "google-libphonenumber";

export const createFullNumber = (countryCode: string, number: string): string =>
  `${countryCode}${number}`.replace(/\s/g, "");

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
  const countryCodesList = regions.map(region =>
    phoneNumberUtil.getCountryCodeForRegion(region).toString()
  );
  return code[0] === "+" && countryCodesList.includes(code.substring(1));
};

export const validatePhoneNumbers = (phoneNumbers: string[]): boolean => {
  for (const phoneNumber of phoneNumbers) {
    if (!fullPhoneNumberValidator(phoneNumber)) {
      return false;
    }
  }
  return true;
};
