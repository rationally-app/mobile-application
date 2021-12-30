import { validateAndCleanNric } from "./validateNric";

describe("validateAndCleanNric", () => {
  describe("should return cleaned nric for valid nric number", () => {
    it("for S series", () => {
      expect.assertions(4);
      // https://en.wikipedia.org/wiki/National_Registration_Identity_Card
      expect(validateAndCleanNric("S0000001I")).toBe("S0000001I");
      expect(validateAndCleanNric("S0000002G")).toBe("S0000002G");
      expect(validateAndCleanNric("S0000003E")).toBe("S0000003E");
      expect(validateAndCleanNric("S0000004C")).toBe("S0000004C");
    });

    it("for T series", () => {
      expect.assertions(2);
      expect(validateAndCleanNric("T1928347F")).toBe("T1928347F");
      expect(validateAndCleanNric("T7189231F")).toBe("T7189231F");
    });

    it("for F series", () => {
      expect.assertions(2);
      expect(validateAndCleanNric("F2143781Q")).toBe("F2143781Q");
      expect(validateAndCleanNric("F8761312R")).toBe("F8761312R");
    });

    it("for G series", () => {
      expect.assertions(2);
      expect(validateAndCleanNric("G1234567X")).toBe("G1234567X");
      expect(validateAndCleanNric("G1206026U")).toBe("G1206026U");
    });

    it("for M series", () => {
      expect.assertions(4);
      expect(validateAndCleanNric("M1234567K")).toBe("M1234567K");
      expect(validateAndCleanNric("M0000002N")).toBe("M0000002N");
      expect(validateAndCleanNric("M0000003L")).toBe("M0000003L");
      expect(validateAndCleanNric("M0000004X")).toBe("M0000004X");
    });

    it("for unique cases", () => {
      expect.assertions(5);
      expect(validateAndCleanNric("  S0000004C")).toBe("S0000004C");
      expect(validateAndCleanNric("  S0000004C    ")).toBe("S0000004C");
      expect(validateAndCleanNric("G1234567X150319SVP")).toBe("G1234567X");
      expect(validateAndCleanNric("S0000001I123A")).toBe("S0000001I");
      expect(validateAndCleanNric("S0000001I^&*(asd123")).toBe("S0000001I");
    });
  });

  it("should throw error for invalid NRIC", () => {
    expect.assertions(16);
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
    expect(() => validateAndCleanNric("F2128749P")).toThrow(errorMessage);
    expect(() => validateAndCleanNric("T8728729U")).toThrow(errorMessage);
    expect(() => validateAndCleanNric("T2916239R")).toThrow(errorMessage);
    expect(() => validateAndCleanNric("2821462")).toThrow(errorMessage);
  });
});
