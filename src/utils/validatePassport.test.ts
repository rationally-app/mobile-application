import { validateAndCleanPassport } from "./validatePassport";

// test to be updated once we get more confirmation on the format to validate
describe("parsePeriod", () => {
  it.each([
    ["a-12345", "A-12345"],
    ["Aa-12345", "AA-12345"],
    ["aAa-12345", "AAA-12345"]
  ])(
    "should pass passport validation with input [%s] and output [%s]",
    (input: string, output: string) => {
      expect(validateAndCleanPassport(input)).toBe(output);
    }
  );
});
