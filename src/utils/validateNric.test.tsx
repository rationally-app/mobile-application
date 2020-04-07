import { validate } from "../components/CustomerDetails/validateNric";

describe("validate", () => {
  it("should return true for valid nric number with S/T/F/G", () => {
    expect.assertions(4);
    expect(validate("S6099517F")).toBe(true);
    expect(validate("T1145794G")).toBe(true);
    expect(validate("F3151357W")).toBe(true);
    expect(validate("G2821461N")).toBe(true);
  });

  it("should return false for invalid NRIC", () => {
    expect.assertions(5);
    expect(validate("S6099518F")).toBe(false);
    expect(validate("T1145795G")).toBe(false);
    expect(validate("F3151358W")).toBe(false);
    expect(validate("G2821462N")).toBe(false);
    expect(validate("2821462")).toBe(false);
  });
});
