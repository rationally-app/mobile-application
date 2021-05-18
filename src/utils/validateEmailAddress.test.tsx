import { validateEmailAddress } from "./validateEmailAddress";

describe("Email validation", () => {
  it.each([
    "test@example.com",
    "rwl-test@gmail.com",
    "test2@gmail.com.sg",
    "      test3@example.com",
    " test4@example.com     ",
    " test5@example.co.sg",
    "test-6@example.com",
    "test+a1@example.com",
  ])("validate valid email-address", (emailAddress: string) => {
    expect.assertions(1);
    expect(validateEmailAddress(emailAddress)).toBe(emailAddress);
  });

  it.each(["@example.com", "rwl", "", "1"])(
    "validate Invalid email-address",
    (emailAddress: any) => {
      expect.assertions(1);
      const errorMessage = "Enter valid email address";
      expect(() => validateEmailAddress(emailAddress)).toThrow(errorMessage);
    }
  );
});
