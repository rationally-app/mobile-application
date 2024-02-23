import { decodeQr } from "./utils";

describe("decodeQr", () => {
  it("should fail for old, deprecated QR codes", () => {
    expect.assertions(2);
    const code = "1e4457bc-f7d0-4329-a344-f0e3c75d8dd4";
    expect(() => decodeQr(code)).toThrow("No endpoint");
    const url = "https://example.com";
    expect(() => decodeQr(url)).toThrow("No endpoint");
  });

  it("should decode the correct qr code and return endpoint and key", () => {
    expect.assertions(4);
    const code = `{"key": "1e4457bc-f7d0-4329-a344-f0e3c75d8dd4","endpoint": "https://endpoint.com"}`;
    const url =
      "https://this-is-the-base-url.com?key=1e4457bc-f7d0-4329-a344-f0e3c75d8dd4&endpoint=https://endpoint.com";
    const jsonParsed = decodeQr(code);
    const urlParsed = decodeQr(url);
    expect(jsonParsed.endpoint).toBe("https://endpoint.com");
    expect(jsonParsed.key).toBe("1e4457bc-f7d0-4329-a344-f0e3c75d8dd4");
    expect(urlParsed.endpoint).toBe("https://endpoint.com");
    expect(urlParsed.key).toBe("1e4457bc-f7d0-4329-a344-f0e3c75d8dd4");
  });

  it("should throw if the code can be parsed but does not contain the right fields", () => {
    expect.assertions(9);
    const missingKeyJSON = `{"keys": "1e4457bc-f7d0-4329-a344-f0e3c75d8dd4","endpoint": "https://somewhere.com"}`;
    expect(() => decodeQr(missingKeyJSON)).toThrow("No key");

    const missingEndpointJSON = `{"key": "1e4457bc-f7d0-4329-a344-f0e3c75d8dd4","endpointed": "https://somewhere.com"}`;
    expect(() => decodeQr(missingEndpointJSON)).toThrow("No endpoint");

    const syntaxError = `xxx{"key": "1e4457bc-f7d0-4329-a344-f0e3c75d8dd4","endpoint": "https://somewhere.com"}`;
    expect(() => decodeQr(syntaxError)).toThrow("No endpoint");

    const jsonNoEndPoint = `{"key": "1e4457bc-f7d0-4329-a344-f0e3c75d8dd4"}`;
    expect(() => decodeQr(jsonNoEndPoint)).toThrow("No endpoint");

    const jsonNoKey = `{"endpoint": "example"}`;
    expect(() => decodeQr(jsonNoKey)).toThrow("No key");

    const missingKeyURL =
      "http://example.com?keys=1e4457bc-f7d0-4329-a344-f0e3c75d8dd4&endpoint=https://somewhere.com";
    expect(() => decodeQr(missingKeyURL)).toThrow("No key");

    const missingEndpointURL =
      "http://example.com?key=1e4457bc-f7d0-4329-a344-f0e3c75d8dd4&endpointed=https://somewhere.com";
    expect(() => decodeQr(missingEndpointURL)).toThrow("No endpoint");

    const urlNoKey = "https://example.com?endpoint=example";
    expect(() => decodeQr(urlNoKey)).toThrow("No key");

    const urlNoEndPoint = "https://example.com?key=example";
    expect(() => decodeQr(urlNoEndPoint)).toThrow("No endpoint");
  });
});
