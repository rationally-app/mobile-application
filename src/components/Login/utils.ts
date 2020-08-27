import { ERROR_MESSAGE } from "../../context/alert";

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
      throw new Error(ERROR_MESSAGE.AUTH_FAILURE_INVALID_FORMAT);
    if (!parsedCode.key)
      throw new Error(ERROR_MESSAGE.AUTH_FAILURE_INVALID_FORMAT);
    return { endpoint: parsedCode.endpoint, key: parsedCode.key };
  } catch (e) {
    if (e.message.includes("token") || e instanceof SyntaxError)
      throw new Error(ERROR_MESSAGE.AUTH_FAILURE_INVALID_FORMAT);
    throw e;
  }
};
