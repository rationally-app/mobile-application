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
          textInputType: "NUMBER",
        },
        {
          label: "number without regex",
          value: "12345678",
          textInputType: "NUMBER",
        },
        {
          label: "string with regex",
          value: "AA:BB:CC",
          validationRegex: "^[a-zA-Z:]+$",
          textInputType: "STRING",
        },
        {
          label: "string without regex",
          value: "AA:BB",
          textInputType: "STRING",
        },
        {
          label: "valid phone number",
          value: "+6591234567",
          textInputType: "PHONE_NUMBER",
        },
        {
          label: "another valid phone number",
          value: "+13475679064",
          textInputType: "PHONE_NUMBER",
        },
        {
          label: "payment receipt with regex",
          value: "1234acbd5678qwer1234",
          validationRegex: "(\\0*|^([A-Za-z0-9])*)$",
          textInputType: "PAYMENT_RECEIPT",
        },
        {
          label: "payment receipt with regex and empty value optional",
          isOptional: true,
          value: "",
          validationRegex: "(\\0*|^([A-Za-z0-9])*)$",
          textInputType: "PAYMENT_RECEIPT",
        },
        {
          label: "payment receipt without regex",
          value: "within20characters",
          textInputType: "PAYMENT_RECEIPT",
        },
        {
          label: "number is optional",
          isOptional: true,
          value: "",
          textInputType: "NUMBER",
        },
        {
          label: "string is optional",
          isOptional: true,
          value: "",
          textInputType: "STRING",
        },
        {
          label: "phone number is optional",
          isOptional: true,
          value: "",
          textInputType: "PHONE_NUMBER",
        },
        {
          label: "payment receipt is optional",
          isOptional: true,
          value: "",
          textInputType: "PAYMENT_RECEIPT",
        },
        {
          label: "any character validation regex",
          value: "a1@/~$",
          validationRegex: "[\\s\\S]*",
        },
        {
          label: "payment qr",
          value:
            "00020101021102164761360000000*1704155123456789123451110123456789012153123456789012341531250003440001034450003445311000126330015SG.COM.DASH.WWW0110000005550127670014A00000076200010120COM.LQDPALLIANCE.WWW021512345678901234503020028660011SG.COM.OCBC0147OCBCP2P629A358D-ECE7-4554-AD56-EBD12D84CA7E4F7329500006SG.EZI013603600006-76bb-4a5a-aa1a-fbcb64d6ecf530850013SG.COM.EZLINK01201234567890123456-1230204SGQR0324A123456,B123456,C12345670404A23X31260008COM.GRAB0110A93FO3230Q32390007COM.DBS011012345678900210123456789033900011SG.COM.NETS01230201401832831128823590002150001118703240000308885872010901199084E5DC3D834430017COM.QQ.WEIXIN.PAY011012345678900204123435660010SG.COM.UOB014845D233507F5E8C306E3871A4E9FACA601A80C114B5645E5D36840009SG.PAYNOW010120216+621234567890123030100408209912310525123456789012345678901234537270009SG.AIRPAY0110A11BC0000X51860007SG.SGQR0112180307510317020701.0003030608100604020205031380609Counter010708201804075204581453037025802SG5916FOOD XYZ PTE LTD6009SINGAPORE6106081006626001081234567R0607876543050330015SG.COM.DASH.WWW0110000005550263045E8D",
          validationRegex: "[\\s\\S]*",
          textInputType: "PAYMENT_QR",
        },
      ])
    ).toBe(true);
  });

  it("should throw error if input is phone number and fails default regex", () => {
    expect.assertions(3);
    expect(() =>
      validateIdentifierInputs([
        {
          label: "input without +",
          value: "1234567",
          textInputType: "PHONE_NUMBER",
        },
      ])
    ).toThrow("Enter a valid country code and contact number.");
    expect(() =>
      validateIdentifierInputs([
        {
          label: "input with invalid characters",
          value: "+1234567~",
          textInputType: "PHONE_NUMBER",
        },
      ])
    ).toThrow("Enter a valid country code and contact number.");
    expect(() =>
      validateIdentifierInputs([
        {
          label: "input with spaces",
          value: "+1234567 890",
          textInputType: "PHONE_NUMBER",
        },
      ])
    ).toThrow("Enter a valid country code and contact number.");
  });

  it("should throw error if at least one of the identifiers does not match the given regex pattern", () => {
    expect.assertions(2);
    expect(() =>
      validateIdentifierInputs([
        {
          label: "number identifier with regex",
          value: "1234567",
          validationRegex: "^[0-9]{8}$",
          textInputType: "NUMBER",
        },
      ])
    ).toThrow("Enter or scan a valid code.");
    expect(() =>
      validateIdentifierInputs([
        {
          label: "string identifier with regex",
          value: "-HELLO-",
          validationRegex: "^[0-9A-Z]$",
          textInputType: "STRING",
        },
      ])
    ).toThrow("Enter or scan a valid code.");
  });

  it("should throw error if at least one of the identifiers is an invalid number", () => {
    expect.assertions(2);
    expect(() =>
      validateIdentifierInputs([
        {
          label: "number identifier",
          value: "this is not a number",
          textInputType: "NUMBER",
        },
      ])
    ).toThrow("Enter or scan a valid code.");
    expect(() =>
      validateIdentifierInputs([
        {
          label: "number identifier",
          value: "123string",
          textInputType: "NUMBER",
        },
      ])
    ).toThrow("Enter or scan a valid code.");
  });

  it("should throw error if at least one of the identifiers is an invalid phone number", () => {
    expect.assertions(2);
    expect(() =>
      validateIdentifierInputs([
        {
          label: "invalid phone number",
          value: "+659",
          textInputType: "PHONE_NUMBER",
        },
      ])
    ).toThrow("Enter a valid country code and contact number.");
    expect(() =>
      validateIdentifierInputs([
        {
          label: "another invalid phone number",
          value: "+191234567",
          textInputType: "PHONE_NUMBER",
        },
      ])
    ).toThrow("Enter a valid country code and contact number.");
  });

  it("should throw error if non optional identifier has empty value", () => {
    expect.assertions(2);
    expect(() =>
      validateIdentifierInputs([
        {
          label: "empty string",
          value: "",
          textInputType: "STRING",
        },
      ])
    ).toThrow("Enter or scan a code.");
    expect(() =>
      validateIdentifierInputs([
        {
          label: "empty number",
          value: "",
          textInputType: "NUMBER",
        },
        {
          label: "string identifier",
          value: "random string",
          textInputType: "STRING",
        },
      ])
    ).toThrow("Enter or scan a code.");
  });

  it("should throw error if there are duplicate values", () => {
    expect.assertions(1);
    expect(() =>
      validateIdentifierInputs([
        {
          label: "identifier 1",
          value: "same value",
          textInputType: "STRING",
        },
        {
          label: "identifier 2",
          value: "same value",
          textInputType: "STRING",
        },
        {
          label: "identifier 3",
          value: "not same value",
          textInputType: "STRING",
        },
      ])
    ).toThrow("Enter or scan a different code.");
  });

  it("should throw the specific error if the textInputType is payment receipt", () => {
    expect.assertions(4);

    expect(() =>
      validateIdentifierInputs([
        {
          label: "Payment receipt number",
          value: "",
          textInputType: "PAYMENT_RECEIPT",
          validationRegex: "^[a-zA-Z0-9]{1,20}$",
        },
      ])
    ).toThrow("Enter a valid payment receipt number.");

    expect(() =>
      validateIdentifierInputs([
        {
          label: "Payment receipt number",
          value: "abcdqwer12345678qwer2", // 21 characters
          textInputType: "PAYMENT_RECEIPT",
          validationRegex: "^[a-zA-Z0-9]{1,20}$",
        },
      ])
    ).toThrow("Enter a valid payment receipt number.");

    expect(() =>
      validateIdentifierInputs([
        {
          label: "Payment receipt number",
          value: "     ",
          textInputType: "PAYMENT_RECEIPT",
          validationRegex: "^[a-zA-Z0-9]{1,20}$",
        },
      ])
    ).toThrow("Enter a valid payment receipt number.");

    expect(() =>
      validateIdentifierInputs([
        {
          label: "Payment receipt number",
          value: "//asd.;'[",
          textInputType: "PAYMENT_RECEIPT",
          validationRegex: "^[a-zA-Z0-9]{1,20}$",
        },
      ])
    ).toThrow("Enter a valid payment receipt number.");
  });

  it("should throw the specific error if the textInputType is payment qr", () => {
    expect.assertions(1);

    expect(() =>
      validateIdentifierInputs([
        {
          label: "payment qr",
          value: "invalid payment qr",
          textInputType: "PAYMENT_QR",
          validationRegex: "[\\s\\S]*",
        },
      ])
    ).toThrow("Enter or scan a valid code.");
  });
});
