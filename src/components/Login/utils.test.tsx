import { decodeQr } from "./utils";

describe("decodeQr", () => {
  it("should fail for old QR codes", () => {
    expect.assertions(1);
    const code = "1e4457bc-f7d0-4329-a344-f0e3c75d8dd4";
    expect(() => decodeQr(code)).toThrow(
      "Invalid QR code format, consider regenerating your QR code"
    );
  });

  it("should decode the correct qr code and return endpoint and key", () => {
    expect.assertions(2);
    const code = `{"key": "1e4457bc-f7d0-4329-a344-f0e3c75d8dd4","endpoint": "https://somewhere.com"}`;
    const { endpoint, key } = decodeQr(code);
    expect(endpoint).toBe("https://somewhere.com");
    expect(key).toBe("1e4457bc-f7d0-4329-a344-f0e3c75d8dd4");
  });

  it("should throw if the code can be parsed but does not contain the right fields", () => {
    expect.assertions(2);
    const missingKey = `{"keys": "1e4457bc-f7d0-4329-a344-f0e3c75d8dd4","endpoint": "https://somewhere.com"}`;
    expect(() => decodeQr(missingKey)).toThrow("No key specified");

    const missingEndpoint = `{"key": "1e4457bc-f7d0-4329-a344-f0e3c75d8dd4","endpointed": "https://somewhere.com"}`;
    expect(() => decodeQr(missingEndpoint)).toThrow("No endpoint specified");
  });
});
