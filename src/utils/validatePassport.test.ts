import { validateAndCleanPassport } from "./validatePassport";

// test to be updated once we get more confirmation on the format to validate
describe("parse passport", () => {
  it.each([
    ["a-12345", "A-12345"],
    ["Aa-12345", "AA-12345"],
    ["aAa-12345", "AAA-12345"],
    ["a-12345abcd", "A-12345ABCD"],
    ["aAa-12345abcd", "AAA-12345ABCD"]
  ])(
    "should pass passport validation with input [%s] and output [%s]",
    (input: string, output: string) => {
      expect(validateAndCleanPassport(input)).toBe(output);
    }
  );

  it.each([
    ["a-1234"],
    ["aAa-12345abcde"],
    ["aAaA-12345"],
    ["aAaA-12345abcdef"]
  ])("should fail passport validation with input [%s]", (input: string) => {
    expect.assertions(1);
    const errorMessage = "Enter or scan valid ID number.";
    expect(() => validateAndCleanPassport(input)).toThrow(errorMessage);
  });
});
