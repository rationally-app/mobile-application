import { decodeQr, mobileNumberValidator, countryCodeValidator } from "./utils";

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

describe("mobileNumberValidator", () => {
  it("should return false for invalid numbers", () => {
    expect.assertions(3);
    expect(mobileNumberValidator("1237123871239018273128901290")).toBe(false);
    expect(mobileNumberValidator("asd")).toBe(false);
    expect(mobileNumberValidator("9182678_LAKASF)Q!K")).toBe(false);
  });

  it("should return true for valid numbers", () => {
    expect.assertions(4);
    expect(mobileNumberValidator("91234567")).toBe(true);
    expect(mobileNumberValidator("+6598261749")).toBe(true);
    expect(mobileNumberValidator("+65 98219374")).toBe(true);
    expect(mobileNumberValidator("0098219374")).toBe(true);
  });
});

describe("countryCodeValidator", () => {
  it("should return false for invalid country codes", () => {
    expect.assertions(2);
    expect(countryCodeValidator("65")).toBe(false);
    expect(countryCodeValidator("+900")).toBe(false);
  });

  it("should return true for valid country codes", () => {
    expect.assertions(4);
    expect(countryCodeValidator("+65")).toBe(true);
    expect(countryCodeValidator("+1")).toBe(true);
    expect(countryCodeValidator("+61")).toBe(true);
    expect(countryCodeValidator("+370")).toBe(true);
  });
});
