import { IdentifierInput } from "../types";
import {
  findValueByKey,
  getUpdatedTransactionsPaymentQRIdentifiers,
} from "./paymentQRHelper";

describe("tests for findValueByKey", () => {
  let records: Record<string, unknown>;

  beforeEach(() => {
    records = {
      transactionAmount: 10,
      merchantAccountInformation: {
        nets: {
          terminalId: "1234567890",
          merchantId: "0987654321",
          nestedObject: {
            nestedProperty: "This is nested",
          },
        },
      },
      merchantName: "Merchant name",
    };
  });

  it("should find value by key properly", () => {
    expect.assertions(1);
    expect(findValueByKey("merchantName", records)).toStrictEqual(
      "Merchant name"
    );
  });

  it("should find two-layer nested value by key properly", () => {
    expect.assertions(1);
    expect(findValueByKey("terminalId", records)).toStrictEqual("1234567890");
  });

  it("should find three-layer nested value by key properly", () => {
    expect.assertions(1);
    expect(findValueByKey("nestedProperty", records)).toStrictEqual(
      "This is nested"
    );
  });

  it("should return `undefined` if key does not exist", () => {
    expect.assertions(1);
    expect(findValueByKey("nonExistentKey", records)).toBeUndefined();
  });
});

describe("tests for getUpdatedTransactionsPaymentQRIdentifiers for non-NETS", () => {
  let paymentQRPayloadWithoutNETS: string;
  let paymentQRIdentifierInput: IdentifierInput;
  let merchantNameIdentifierInput: IdentifierInput;
  let merchantIdIdentifierInput: IdentifierInput;

  beforeAll(() => {
    paymentQRPayloadWithoutNETS =
      "00020101021126520008com.grab0136c99990dc-ab89-442f-accb-1fd96dd4eff627330015sg.com.dash.www0110000000901628460010com.myfave0128https://myfave.com/qr/6ntdz329360009SG.AIRPAY0119936009180000000468751810007SG.SGQR01121809112DE3C7020701.000703065743700402010503105060400000708202012105204581253037025802SG5920UDDERS UPPER THOMSON6009Singapore63047AEC";
    paymentQRIdentifierInput = {
      label: "Payment QR",
      scanButtonType: "QR",
      validationRegex: "[\\s\\S]*",
      textInputType: "PAYMENT_QR",
      value: "",
    };
    merchantNameIdentifierInput = {
      label: "merchantName",
      isOptional: true,
      value: "",
      validationRegex: "^[a-zA-Z0-9 ]*$",
      textInputType: "STRING",
    };
    merchantIdIdentifierInput = {
      label: "merchantId",
      isOptional: true,
      value: "",
      textInputType: "STRING",
    };
  });

  it("should return updated transactions with identifiers properly", () => {
    expect.assertions(1);
    expect(
      getUpdatedTransactionsPaymentQRIdentifiers([
        {
          category: "category-a",
          quantity: 1,
          identifierInputs: [
            { ...paymentQRIdentifierInput, value: paymentQRPayloadWithoutNETS },
            merchantNameIdentifierInput,
          ],
        },
      ])
    ).toStrictEqual([
      {
        category: "category-a",
        quantity: 1,
        identifierInputs: [
          { ...paymentQRIdentifierInput, value: paymentQRPayloadWithoutNETS },
          { ...merchantNameIdentifierInput, value: "UDDERS UPPER THOMSON" },
        ],
      },
    ]);
  });

  it("should return updated transactions with identifiers properly if property does not exist", () => {
    expect.assertions(1);
    expect(
      getUpdatedTransactionsPaymentQRIdentifiers([
        {
          category: "category-a",
          quantity: 1,
          identifierInputs: [
            { ...paymentQRIdentifierInput, value: paymentQRPayloadWithoutNETS },
            merchantIdIdentifierInput,
          ],
        },
      ])
    ).toStrictEqual([
      {
        category: "category-a",
        quantity: 1,
        identifierInputs: [
          { ...paymentQRIdentifierInput, value: paymentQRPayloadWithoutNETS },
          merchantIdIdentifierInput,
        ],
      },
    ]);
  });

  it("should return transactions with identifiers properly if PAYMENT_QR identifier does not exist", () => {
    expect.assertions(1);
    expect(
      getUpdatedTransactionsPaymentQRIdentifiers([
        {
          category: "category-a",
          quantity: 1,
          identifierInputs: [
            {
              ...paymentQRIdentifierInput,
              value: paymentQRPayloadWithoutNETS,
              textInputType: "STRING",
            },
            merchantIdIdentifierInput,
          ],
        },
      ])
    ).toStrictEqual([
      {
        category: "category-a",
        quantity: 1,
        identifierInputs: [
          {
            ...paymentQRIdentifierInput,
            value: paymentQRPayloadWithoutNETS,
            textInputType: "STRING",
          },
          merchantIdIdentifierInput,
        ],
      },
    ]);
  });
});

describe("tests for getUpdatedTransactionsPaymentQRIdentifiers for NETS", () => {
  let paymentQRPayloadWithNETS: string;
  let paymentQRIdentifierInput: IdentifierInput;
  let merchantNameIdentifierInput: IdentifierInput;
  let merchantIdIdentifierInput: IdentifierInput;
  let terminalIdIdentifierInput: IdentifierInput;
  let qrTypeIdentifierInput: IdentifierInput;

  beforeAll(() => {
    paymentQRPayloadWithNETS =
      "00020101021102164761360000000*1704155123456789123451110123456789012153123456789012341531250003440001034450003445311000126330015SG.COM.DASH.WWW0110000005550127670014A00000076200010120COM.LQDPALLIANCE.WWW021512345678901234503020028660011SG.COM.OCBC0147OCBCP2P629A358D-ECE7-4554-AD56-EBD12D84CA7E4F7329500006SG.EZI013603600006-76bb-4a5a-aa1a-fbcb64d6ecf530850013SG.COM.EZLINK01201234567890123456-1230204SGQR0324A123456,B123456,C12345670404A23X31260008COM.GRAB0110A93FO3230Q32390007COM.DBS011012345678900210123456789033900011SG.COM.NETS01230201401832831128823590002150001118703240000308885872010901199084E5DC3D834430017COM.QQ.WEIXIN.PAY011012345678900204123435660010SG.COM.UOB014845D233507F5E8C306E3871A4E9FACA601A80C114B5645E5D36840009SG.PAYNOW010120216+621234567890123030100408209912310525123456789012345678901234537270009SG.AIRPAY0110A11BC0000X51860007SG.SGQR0112180307510317020701.0003030608100604020205031380609Counter010708201804075204581453037025802SG5916FOOD XYZ PTE LTD6009SINGAPORE6106081006626001081234567R0607876543050330015SG.COM.DASH.WWW0110000005550263045E8D";
    paymentQRIdentifierInput = {
      label: "Payment QR",
      scanButtonType: "QR",
      validationRegex: "[\\s\\S]*",
      textInputType: "PAYMENT_QR",
      value: "",
    };
    merchantNameIdentifierInput = {
      label: "merchantName",
      isOptional: true,
      value: "",
      validationRegex: "^[a-zA-Z0-9 ]*$",
      textInputType: "STRING",
    };
    merchantIdIdentifierInput = {
      label: "merchantId",
      isOptional: true,
      value: "",
      textInputType: "STRING",
    };
    terminalIdIdentifierInput = {
      label: "terminalId",
      isOptional: true,
      value: "",
      textInputType: "STRING",
    };
    qrTypeIdentifierInput = {
      label: "qrType",
      isOptional: true,
      value: "",
      textInputType: "STRING",
    };
  });

  it("should return updated transactions with identifiers properly", () => {
    expect.assertions(1);

    expect(
      getUpdatedTransactionsPaymentQRIdentifiers([
        {
          category: "category-a",
          quantity: 1,
          identifierInputs: [
            { ...paymentQRIdentifierInput, value: paymentQRPayloadWithNETS },
            merchantNameIdentifierInput,
            merchantIdIdentifierInput,
            terminalIdIdentifierInput,
          ],
        },
      ])
    ).toStrictEqual([
      {
        category: "category-a",
        quantity: 1,
        identifierInputs: [
          { ...paymentQRIdentifierInput, value: paymentQRPayloadWithNETS },
          { ...merchantNameIdentifierInput, value: "FOOD XYZ PTE LTD" },
          { ...merchantIdIdentifierInput, value: "000111870324000" },
          { ...terminalIdIdentifierInput, value: "88587201" },
        ],
      },
    ]);
  });

  it("should return updated transactions with identifiers properly if property does not exist", () => {
    expect.assertions(1);

    expect(
      getUpdatedTransactionsPaymentQRIdentifiers([
        {
          category: "category-a",
          quantity: 1,
          identifierInputs: [
            { ...paymentQRIdentifierInput, value: paymentQRPayloadWithNETS },
            merchantNameIdentifierInput,
            merchantIdIdentifierInput,
            terminalIdIdentifierInput,
            qrTypeIdentifierInput,
          ],
        },
      ])
    ).toStrictEqual([
      {
        category: "category-a",
        quantity: 1,
        identifierInputs: [
          { ...paymentQRIdentifierInput, value: paymentQRPayloadWithNETS },
          { ...merchantNameIdentifierInput, value: "FOOD XYZ PTE LTD" },
          { ...merchantIdIdentifierInput, value: "000111870324000" },
          { ...terminalIdIdentifierInput, value: "88587201" },
          { ...qrTypeIdentifierInput },
        ],
      },
    ]);
  });

  it("should return transactions with identifiers properly if PAYMENT_QR identifier does not exist", () => {
    expect.assertions(1);
    expect(
      getUpdatedTransactionsPaymentQRIdentifiers([
        {
          category: "category-a",
          quantity: 1,
          identifierInputs: [
            {
              ...paymentQRIdentifierInput,
              value: paymentQRPayloadWithNETS,
              textInputType: "STRING",
            },
            merchantNameIdentifierInput,
            merchantIdIdentifierInput,
            terminalIdIdentifierInput,
          ],
        },
      ])
    ).toStrictEqual([
      {
        category: "category-a",
        quantity: 1,
        identifierInputs: [
          {
            ...paymentQRIdentifierInput,
            value: paymentQRPayloadWithNETS,
            textInputType: "STRING",
          },
          merchantNameIdentifierInput,
          merchantIdIdentifierInput,
          terminalIdIdentifierInput,
        ],
      },
    ]);
  });
});
