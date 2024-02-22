import { AuthInvalidError } from "../../services/auth";
import queryString from "query-string";

interface QrCode {
  version: string;
  endpoint: string;
  key: string;
}

interface DecodedQrResponse {
  endpoint: string;
  key: string;
}

const isJSON = (str: string): boolean => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

const parseURLParams = (url: string): Record<string, string> => {
  const parsed = queryString.parseUrl(url);
  return parsed.query as Record<string, string>;
};

export const decodeQr = (code: string): DecodedQrResponse => {
  try {
    let parsedCode: QrCode;
    if (isJSON(code)) {
      parsedCode = JSON.parse(code);
    } else {
      const params = parseURLParams(code);
      parsedCode = {
        version: "",
        endpoint: params.endpoint as string,
        key: params.key as string,
      };
    }
    if (!parsedCode.endpoint) throw new AuthInvalidError("No endpoint");
    if (!parsedCode.key) throw new AuthInvalidError("No key");
    return { endpoint: parsedCode.endpoint, key: parsedCode.key };
  } catch (e) {
    if (e.message.includes("token") || e instanceof SyntaxError)
      throw new AuthInvalidError("Invalid format");
    throw e;
  }
};
