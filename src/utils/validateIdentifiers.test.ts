import { validateIdentifiers } from "./validateIdentifiers";

describe("validateIdentifiers", () => {
  it("should return true if all identifiers are valid", () => {
    expect.assertions(1);
    expect(
      validateIdentifiers([
        {
          label: "number identifier with regex",
          value: "1234567",
          validationRegex: "^[0-9]{7}$",
          textInputType: "NUMBER"
        },
        {
          label: "number identifier without regex",
          value: "1234567",
          textInputType: "NUMBER"
        },
        {
          label: "string identifier with regex",
          value: "AA:BB",
          validationRegex: "^[a-zA-Z:]+$",
          textInputType: "STRING"
        },
        {
          label: "string identifier without regex",
          value: "AA:BB",
          textInputType: "STRING"
        },
        {
          label: "phone number identifier",
          value: "+6591234567",
          textInputType: "PHONE_NUMBER"
        }
      ])
    ).toBe(true);
  });

  it("should return false if at least one of the identifiers does not match the given regex pattern", () => {
    expect.assertions(2);
    expect(
      validateIdentifiers([
        {
          label: "number identifier with regex",
          value: "1234567",
          validationRegex: "^[0-9]{8}$",
          textInputType: "NUMBER"
        }
      ])
    ).toBe(false);
    expect(
      validateIdentifiers([
        {
          label: "string identifier with regex",
          value: "-HELLO-",
          validationRegex: "^[0-9A-Z]$",
          textInputType: "STRING"
        }
      ])
    ).toBe(false);
  });

  it("should return false if at least one of the identifiers is an invalid number", () => {
    expect.assertions(2);
    expect(
      validateIdentifiers([
        {
          label: "number identifier",
          value: "this is not a number",
          textInputType: "NUMBER"
        }
      ])
    ).toBe(false);
    expect(
      validateIdentifiers([
        {
          label: "number identifier",
          value: "123string",
          textInputType: "NUMBER"
        }
      ])
    ).toBe(false);
  });
});
