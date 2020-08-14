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
    if (!parsedCode.endpoint)
      throw new Error(
        "We are currently facing login issues. Get a new QR code from your in-charge."
      );
    if (!parsedCode.key)
      throw new Error(
        "We are currently facing login issues. Get a new QR code from your in-charge."
      );
    return { endpoint: parsedCode.endpoint, key: parsedCode.key };
  } catch (e) {
    if (e.message.includes("Unexpected token"))
      throw new Error(
        "Scan QR code again or get a new QR code from your in-charge."
      );
    throw e;
  }
};
