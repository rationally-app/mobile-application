import { AuthInvalidError } from "../../services/auth";

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

function parseURLParams(url: string): QrCode {
  const queryString = url.split("?")[1];
  const result: QrCode = { version: "", endpoint: "", key: "" };
  if (queryString) {
    const queryParams = queryString.split("&");
    for (const param of queryParams) {
      const [key, value] = param.split("=");
      if (key === "endpoint") result.endpoint = value;
      if (key === "key") result.key = value;
    }
  }
  result["version"] = "";
  return result;
}

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
