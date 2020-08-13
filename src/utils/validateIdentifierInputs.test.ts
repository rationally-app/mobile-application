import { validateIdentifierInputs } from "./validateIdentifierInputs";

describe("validateIdentifierInputs", () => {
  it("should return true if all identifiers are valid", () => {
    expect.assertions(1);
    expect(
      validateIdentifierInputs([
        {
          label: "number with regex",
          value: "1234567",
          validationRegex: "^[0-9]{7}$",
          textInputType: "NUMBER"
        },
        {
          label: "number without regex",
          value: "12345678",
          textInputType: "NUMBER"
        },
        {
          label: "string with regex",
          value: "AA:BB:CC",
          validationRegex: "^[a-zA-Z:]+$",
          textInputType: "STRING"
        },
        {
          label: "string without regex",
          value: "AA:BB",
          textInputType: "STRING"
        },
        {
          label: "valid phone number",
          value: "+6591234567",
          textInputType: "PHONE_NUMBER"
        },
        {
          label: "another valid phone number",
          value: "+13475679064",
          textInputType: "PHONE_NUMBER"
        }
      ])
    ).toBe(true);
  });

  it("should throw error if at least one of the identifiers does not match the given regex pattern", () => {
    expect.assertions(2);
    expect(() =>
      validateIdentifierInputs([
        {
          label: "number identifier with regex",
          value: "1234567",
          validationRegex: "^[0-9]{8}$",
          textInputType: "NUMBER"
        }
      ])
    ).toThrow("Enter your voucher code again");
    expect(() =>
      validateIdentifierInputs([
        {
          label: "string identifier with regex",
          value: "-HELLO-",
          validationRegex: "^[0-9A-Z]$",
          textInputType: "STRING"
        }
      ])
    ).toThrow("Enter your voucher code again");
  });

  it("should throw error if at least one of the identifiers is an invalid number", () => {
    expect.assertions(2);
    expect(() =>
      validateIdentifierInputs([
        {
          label: "number identifier",
          value: "this is not a number",
          textInputType: "NUMBER"
        }
      ])
    ).toThrow("Enter your voucher code again");
    expect(() =>
      validateIdentifierInputs([
        {
          label: "number identifier",
          value: "123string",
          textInputType: "NUMBER"
        }
      ])
    ).toThrow("Enter your voucher code again");
  });

  it("should throw error if at least one of the identifiers is an invalid phone number", () => {
    expect.assertions(2);
    expect(() =>
      validateIdentifierInputs([
        {
          label: "invalid phone number",
          value: "+659",
          textInputType: "PHONE_NUMBER"
        }
      ])
    ).toThrow("Enter your contact number again");
    expect(() =>
      validateIdentifierInputs([
        {
          label: "another invalid phone number",
          value: "+191234567",
          textInputType: "PHONE_NUMBER"
        }
      ])
    ).toThrow("Enter your contact number again");
  });

  it("should throw error if at least one of the identifiers has empty value", () => {
    expect.assertions(1);
    // expect(() =>
    //   validateIdentifierInputs([
    //     {
    //       label: "empty string",
    //       value: "",
    //       textInputType: "STRING"
    //     }
    //   ])
    // ).toThrow("Please enter details to checkout");
    expect(() =>
      validateIdentifierInputs([
        {
          label: "empty number",
          value: "",
          textInputType: "NUMBER"
        },
        {
          label: "string identifier",
          value: "random string",
          textInputType: "STRING"
        }
      ])
    ).toThrow("Enter your voucher code");
  });

  it("should throw error if there are duplicate values", () => {
    expect.assertions(1);
    expect(() =>
      validateIdentifierInputs([
        {
          label: "identifier 1",
          value: "same value",
          textInputType: "STRING"
        },
        {
          label: "identifier 2",
          value: "same value",
          textInputType: "STRING"
        },
        {
          label: "identifier 3",
          value: "not same value",
          textInputType: "STRING"
        }
      ])
    ).toThrow("Please enter unique details to checkout");
  });
});
