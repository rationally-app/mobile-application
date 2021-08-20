import { cleanIdentifierInputs } from "./cleanIdentifierInputs";

describe("cleanIdentifierInputs", () => {
  it("should return cleaned input for identifiers with whitespaces", () => {
    expect.assertions(1);
    expect(
      cleanIdentifierInputs(
        [
          {
            label: "phone number with whitespace",
            value: "  +6591234567  ",
            textInputType: "PHONE_NUMBER",
          },
          {
            label: "payment receipt with regex and whitespace",
            value: "         1234acbd5678qwer1234          ",
            validationRegex: "(\\0*|^([A-Za-z0-9])*)$",
            textInputType: "PAYMENT_RECEIPT",
          },
          {
            label: "payment receipt without regex and with whitespace",
            value: " aaaaa  ",
            textInputType: "PAYMENT_RECEIPT",
          },
        ],
        []
      )
    ).toStrictEqual([
      {
        label: "phone number with whitespace",
        value: "+6591234567",
        textInputType: "PHONE_NUMBER",
      },
      {
        label: "payment receipt with regex and whitespace",
        value: "1234acbd5678qwer1234",
        validationRegex: "(\\0*|^([A-Za-z0-9])*)$",
        textInputType: "PAYMENT_RECEIPT",
      },
      {
        label: "payment receipt without regex and with whitespace",
        value: "aaaaa",
        textInputType: "PAYMENT_RECEIPT",
      },
    ]);
  });

  it("should add isOptional param to optional identifiers", () => {
    expect.assertions(1);
    expect(
      cleanIdentifierInputs(
        [
          {
            label: "optional string",
            value: "",
            isOptional: true,
          },
        ],
        ["optional string"]
      )
    ).toStrictEqual([
      {
        label: "optional string",
        value: "",
        isOptional: true,
      },
    ]);
  });
});
