import {
  formatPhoneNumber,
  stripPhoneNumberFormatting,
} from "./phoneNumberFormatter";

const testPhoneNumber = "88888888";
const testShortPhoneNumber = "123";
const testLongPhoneNumber = "888888888888";
const formattedPhoneNumber = "8888 8888";

describe("formatPhoneNumber", () => {
  it("should format SG region numbers correctly", () => {
    expect.assertions(1);
    expect(formatPhoneNumber(testPhoneNumber)).toBe(formattedPhoneNumber);
  });

  it("should format unknown region numbers as SG region numbers", () => {
    expect.assertions(1);
    expect(formatPhoneNumber(testPhoneNumber, "INVALID")).toBe(
      formattedPhoneNumber
    );
  });

  it("should not format numbers if they are too short", () => {
    expect.assertions(1);
    expect(formatPhoneNumber(testShortPhoneNumber)).toBe(testShortPhoneNumber);
  });

  it("should truncate and format numbers if they are too long", () => {
    expect.assertions(1);
    expect(formatPhoneNumber(testLongPhoneNumber)).toBe(formattedPhoneNumber);
  });

  it("should format other region numbers", () => {
    expect.assertions(2);
    // USA
    expect(formatPhoneNumber("5555551234", "1")).toBe("555-555-1234");
    // Malaysia
    expect(formatPhoneNumber("312341234", "60")).toBe("3-1234 1234");
  });
});

describe("stripPhoneNumberFormatting", () => {
  it("should strip formatting from all formatted phone numbers", () => {
    expect.assertions(4);
    // Singapore
    let formatted = formatPhoneNumber(testPhoneNumber);
    expect(formatted).toBe(formattedPhoneNumber);
    let stripped = stripPhoneNumberFormatting(formatted);
    expect(stripped).toBe(testPhoneNumber);
    // USA
    formatted = formatPhoneNumber("5555551234", "1");
    expect(formatted).toBe("555-555-1234");
    stripped = stripPhoneNumberFormatting(formatted);
    expect(stripped).toBe("5555551234");
  });
});
