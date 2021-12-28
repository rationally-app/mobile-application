import { validateAndCleanNric } from "./validateNric";

describe("validateAndCleanNric", () => {
  it("should return cleaned nric for valid nric number", () => {
    expect.assertions(14);
    // https://en.wikipedia.org/wiki/National_Registration_Identity_Card
    expect(validateAndCleanNric("S0000001I")).toBe("S0000001I");
    expect(validateAndCleanNric("S0000002G")).toBe("S0000002G");
    expect(validateAndCleanNric("S0000003E")).toBe("S0000003E");
    expect(validateAndCleanNric("S0000004C")).toBe("S0000004C");
    expect(validateAndCleanNric("M1234567K")).toBe("M1234567K");
    expect(validateAndCleanNric("M0000002N")).toBe("M0000002N");
    expect(validateAndCleanNric("M0000003L")).toBe("M0000003L");
    expect(validateAndCleanNric("M0000004X")).toBe("M0000004X");
    expect(validateAndCleanNric("  S0000004C")).toBe("S0000004C");
    expect(validateAndCleanNric("  S0000004C    ")).toBe("S0000004C");
    expect(validateAndCleanNric("G1234567X")).toBe("G1234567X");
    expect(validateAndCleanNric("G1234567X150319SVP")).toBe("G1234567X");
    expect(validateAndCleanNric("S0000001I123A")).toBe("S0000001I");
    expect(validateAndCleanNric("S0000001I^&*(asd123")).toBe("S0000001I");
  });

  it("should throw error for invalid NRIC", () => {
    expect.assertions(10);
    const errorMessage = "Enter or scan a valid ID number.";
    expect(() => validateAndCleanNric("S0000001A")).toThrow(errorMessage);
    expect(() => validateAndCleanNric("123AS0000001I")).toThrow(errorMessage);
    expect(() => validateAndCleanNric("S0000001A123A")).toThrow(errorMessage);
    expect(() => validateAndCleanNric("S0000002B")).toThrow(errorMessage);
    expect(() => validateAndCleanNric("S0000003C")).toThrow(errorMessage);
    expect(() => validateAndCleanNric("S0000004D")).toThrow(errorMessage);
    expect(() => validateAndCleanNric("M1234873S")).toThrow(errorMessage);
    expect(() => validateAndCleanNric("M4398273E")).toThrow(errorMessage);
    expect(() => validateAndCleanNric("M2987349P")).toThrow(errorMessage);
    expect(() => validateAndCleanNric("G1234873S")).toThrow(errorMessage);
    expect(() => validateAndCleanNric("G4398273E")).toThrow(errorMessage);
    expect(() => validateAndCleanNric("F2987349P")).toThrow(errorMessage);
    expect(() => validateAndCleanNric("2821462")).toThrow(errorMessage);
  });
});
