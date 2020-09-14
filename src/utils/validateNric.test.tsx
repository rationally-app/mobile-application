import { validateAndCleanNric } from "./validateNric";

describe("validateAndCleanNric", () => {
  it("should return cleaned nric for valid nric number", () => {
    expect.assertions(10);
    // https://en.wikipedia.org/wiki/National_Registration_Identity_Card
    expect(validateAndCleanNric("S0000001I")).toBe("S0000001I");
    expect(validateAndCleanNric("S0000002G")).toBe("S0000002G");
    expect(validateAndCleanNric("S0000003E")).toBe("S0000003E");
    expect(validateAndCleanNric("S0000004C")).toBe("S0000004C");
    expect(validateAndCleanNric("  S0000004C")).toBe("S0000004C");
    expect(validateAndCleanNric("  S0000004C    ")).toBe("S0000004C");
    expect(validateAndCleanNric("G1234567X")).toBe("G1234567X");
    expect(validateAndCleanNric("G1234567X150319SVP")).toBe("G1234567X");
    expect(validateAndCleanNric("S0000001I123A")).toBe("S0000001I");
    expect(validateAndCleanNric("S0000001I^&*(asd123")).toBe("S0000001I");
  });

  it("should throw error for invalid NRIC", () => {
    expect.assertions(7);
    const errorMessage = "Enter or scan valid ID number.";
    expect(() => validateAndCleanNric("S0000001A")).toThrow(errorMessage);
    expect(() => validateAndCleanNric("123AS0000001I")).toThrow(errorMessage);
    expect(() => validateAndCleanNric("S0000001A123A")).toThrow(errorMessage);
    expect(() => validateAndCleanNric("S0000002B")).toThrow(errorMessage);
    expect(() => validateAndCleanNric("S0000003C")).toThrow(errorMessage);
    expect(() => validateAndCleanNric("S0000004D")).toThrow(errorMessage);
    expect(() => validateAndCleanNric("2821462")).toThrow(errorMessage);
  });
});
