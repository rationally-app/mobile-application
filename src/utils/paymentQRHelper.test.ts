import { Transaction } from "../types";
import {
  findValueByKey,
  updateTransactionsPaymentQRIdentifiers,
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

  it("should find nested value by key properly", () => {
    expect.assertions(1);
    expect(findValueByKey("terminalId", records)).toStrictEqual("1234567890");
  });

  it("should return `undefined` if key does not exist", () => {
    expect.assertions(1);
    expect(findValueByKey("nonExistentKey", records)).toBeUndefined();
  });
});

describe("tests for updateTransactionsPaymentQRIdentifiers", () => {
  let transactionsBeforeUpdate: Array<Transaction>;

  beforeEach(() => {
    transactionsBeforeUpdate = [
      {
        category: "category-a",
        quantity: 1,
        identifierInputs: [
          {
            label: "Payment QR",
            scanButtonType: "QR",
            validationRegex: "[\\s\\S]*",
            value:
              "00020101021126520008com.grab0136c99990dc-ab89-442f-accb-1fd96dd4eff627330015sg.com.dash.www0110000000901628460010com.myfave0128https://myfave.com/qr/6ntdz329360009SG.AIRPAY0119936009180000000468751810007SG.SGQR01121809112DE3C7020701.000703065743700402010503105060400000708202012105204581253037025802SG5920UDDERS UPPER THOMSON6009Singapore63047AEC",
            textInputType: "PAYMENT_QR",
          },
          {
            label: "merchantName",
            isOptional: true,
            value: "",
            validationRegex: "^[a-zA-Z0-9 ]*$",
            textInputType: "STRING",
          },
        ],
      },
    ];
  });

  it("should update identifiers properly", () => {
    expect.assertions(1);
    updateTransactionsPaymentQRIdentifiers(transactionsBeforeUpdate);
    expect(transactionsBeforeUpdate).toStrictEqual([
      {
        category: "category-a",
        quantity: 1,
        identifierInputs: [
          {
            label: "Payment QR",
            scanButtonType: "QR",
            validationRegex: "[\\s\\S]*",
            value:
              "00020101021126520008com.grab0136c99990dc-ab89-442f-accb-1fd96dd4eff627330015sg.com.dash.www0110000000901628460010com.myfave0128https://myfave.com/qr/6ntdz329360009SG.AIRPAY0119936009180000000468751810007SG.SGQR01121809112DE3C7020701.000703065743700402010503105060400000708202012105204581253037025802SG5920UDDERS UPPER THOMSON6009Singapore63047AEC",
            textInputType: "PAYMENT_QR",
          },
          {
            label: "merchantName",
            isOptional: true,
            value: "UDDERS UPPER THOMSON",
            validationRegex: "^[a-zA-Z0-9 ]*$",
            textInputType: "STRING",
          },
        ],
      },
    ]);
  });
});
