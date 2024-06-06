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

const parseURLParams = (url: string): QrCode => {
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
};

export const decodeQr = (code: string): DecodedQrResponse => {
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
  if (!parsedCode.endpoint && !parsedCode.key)
    throw new AuthInvalidError("Invalid format");
  if (!parsedCode.endpoint) throw new AuthInvalidError("No endpoint");
  if (!parsedCode.key) throw new AuthInvalidError("No key");

  // We had some issues with deep-linking endpoints on web app,
  // and had to use ASCII encoding of special characters as a solution
  // However the mobile app doesn't seem to recognise this well hence we
  // need to replace them if present
  const cleanedEndpoint = parsedCode.endpoint.replace(
    "https%3A%2F%2F",
    "https://"
  );

  return { endpoint: cleanedEndpoint, key: parsedCode.key };
};
