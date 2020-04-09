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

export const mobileNumberValidator = (number: string): boolean => {
  const phoneNumberUtil = new PhoneNumberUtil();
  const regions = phoneNumberUtil.getSupportedRegions();
  let validatorArray: boolean[] = [];
  try {
    validatorArray = regions.map(code => {
      const mobileNumber = phoneNumberUtil.parse(number, code);
      return phoneNumberUtil.isValidNumberForRegion(mobileNumber, code);
    });
  } catch {}

  return validatorArray.includes(true);
};
