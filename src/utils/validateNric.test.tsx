import { validate } from "./validateNric";

describe("validate", () => {
  it("should return true for valid nric number", () => {
    expect.assertions(4);
    // https://en.wikipedia.org/wiki/National_Registration_Identity_Card
    expect(validate("S0000001I")).toBe(true);
    expect(validate("S0000002G")).toBe(true);
    expect(validate("S0000003E")).toBe(true);
    expect(validate("S0000004C")).toBe(true);
  });

  it("should return false for invalid NRIC", () => {
    expect.assertions(5);
    expect(validate("S0000001A")).toBe(false);
    expect(validate("S0000002B")).toBe(false);
    expect(validate("S0000003C")).toBe(false);
    expect(validate("S0000004D")).toBe(false);
    expect(validate("2821462")).toBe(false);
  });
});
