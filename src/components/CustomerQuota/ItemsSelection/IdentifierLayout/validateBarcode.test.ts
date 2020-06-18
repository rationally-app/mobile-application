import { validateBarcode } from "./validateBarcode";

describe("validateBarcode", () => {
  it("should return true if barcode only has alphanumericals or :", () => {
    expect.assertions(3);
    expect(validateBarcode("AA:BB:CC:DD:EE:FF")).toBe(true);
    expect(validateBarcode("V0001")).toBe(true);
    expect(validateBarcode("202070000")).toBe(true);
  });

  it("should return false if barcode contains other special characters", () => {
    expect.assertions(2);
    expect(validateBarcode(`{barcode: "barcode"}`)).toBe(false);
    expect(validateBarcode(") AND 1 = 1")).toBe(false);
  });
});
