import { PhoneNumberUtil } from "google-libphonenumber";

interface QrCode {
  version: string;
  endpoint: string;
  key: string;
}

interface DecodedQrResponse {
  endpoint: string;
  key: string;
}

export const decodeQr = (code: string): DecodedQrResponse => {
  try {
    const parsedCode: QrCode = JSON.parse(code);
    if (!parsedCode.endpoint) throw new Error("No endpoint specified");
    if (!parsedCode.key) throw new Error("No key specified");
    return { endpoint: parsedCode.endpoint, key: parsedCode.key };
  } catch (e) {
    if (e.message.includes("Unexpected token"))
      throw new Error(
        "Invalid QR code format, consider regenerating your QR code"
      );
    throw e;
  }
};

export const createFullNumber = (countryCode: string, number: string): string =>
  `${countryCode}${number}`.replace(/\s/g, "");

export const mobileNumberValidator = (
  countryCode: string,
  number: string
): boolean => {
  if (!/^[0-9]*$/.test(number) || number.length === 0) {
    return false;
  }
  const phoneNumberUtil = new PhoneNumberUtil();
  const parsedNumber = phoneNumberUtil.parse(
    createFullNumber(countryCode, number)
  );
  const regionCode = phoneNumberUtil.getRegionCodeForNumber(parsedNumber);
  return phoneNumberUtil.isValidNumberForRegion(parsedNumber, regionCode);
};

export const countryCodeValidator = (code: string): boolean => {
  const phoneNumberUtil = new PhoneNumberUtil();
  const regions = phoneNumberUtil.getSupportedRegions();
  const countryCodesList = regions.map(region =>
    phoneNumberUtil.getCountryCodeForRegion(region).toString()
  );
  return code[0] === "+" && countryCodesList.includes(code.substring(1));
};
