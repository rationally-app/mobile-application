import {
  cleanIdentifierInput,
  tagOptionalIdentifierInput,
} from "./utilsIdentifierInput";

describe("cleanIdentifierInput", () => {
  it.each([
    [
      {
        label: "phone number with whitespace",
        value: "  +6591234567  ",
        textInputType: "PHONE_NUMBER" as const,
      },
      {
        label: "phone number with whitespace",
        value: "+6591234567",
        textInputType: "PHONE_NUMBER",
      },
    ],
    [
      {
        label: "payment receipt with regex and whitespace",
        value: "         1234acbd5678qwer1234          ",
        validationRegex: "(\\0*|^([A-Za-z0-9])*)$",
        textInputType: "PAYMENT_RECEIPT" as const,
      },
      {
        label: "payment receipt without regex and whitespace",
        value: "1234acbd5678qwer1234",
        validationRegex: "(\\0*|^([A-Za-z0-9])*)$",
        textInputType: "PAYMENT_RECEIPT",
      },
    ],
    [
      {
        label: "payment receipt with regex and with whitespace",
        value: " aaaaa  ",
        textInputType: "PAYMENT_RECEIPT" as const,
      },
      {
        label: "payment receipt without regex and with whitespace",
        value: "aaaaa",
        textInputType: "PAYMENT_RECEIPT",
      },
    ],
  ])(
    "should return cleaned input for identifiers with leading/trailing whitespace",
    (before, after) => {
      expect.assertions(1);
      cleanIdentifierInput(before);
      expect(before).toStrictEqual(after);
    }
  );

  describe("tagOptionalIdentifierInput", () => {
    it("should add isOptional param to optional identifiers", () => {
      expect.assertions(1);
      const identifier = {
        label: "optional string",
        value: "string",
      };
      const category = "category";
      const optionalIdentifierLabels = ["category.optional string"];
      tagOptionalIdentifierInput(
        identifier,
        category,
        optionalIdentifierLabels
      );
      expect(identifier).toStrictEqual({
        label: "optional string",
        value: "string",
        isOptional: true,
      });
    });

    it("should not add isOptional param to non optional identifiers", () => {
      expect.assertions(1);
      const identifier = {
        label: "not optional string",
        value: "string",
      };
      const category = "category";
      const optionalIdentifierLabels = ["category.not_string"];
      tagOptionalIdentifierInput(
        identifier,
        category,
        optionalIdentifierLabels
      );
      expect(identifier).toStrictEqual({
        label: "not optional string",
        value: "string",
      });
    });
  });
});
