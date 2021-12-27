import { parseAndValidateSGQR } from "@rationally-app/payment-qr-parser";

describe("SGQR Service Test", () => {
  it("should parse SGQR payload properly", () => {
    const sgqrPayload =
      "00020101021102164761360000000*1704155123456789123451110123456789012153123456789012341531250003440001034450003445311000126330015SG.COM.DASH.WWW0110000005550127670014A00000076200010120COM.LQDPALLIANCE.WWW021512345678901234503020028660011SG.COM.OCBC0147OCBCP2P629A358D-ECE7-4554-AD56-EBD12D84CA7E4F7329500006SG.EZI013603600006-76bb-4a5a-aa1a-fbcb64d6ecf530850013SG.COM.EZLINK01201234567890123456-1230204SGQR0324A123456,B123456,C12345670404A23X31260008COM.GRAB0110A93FO3230Q32390007COM.DBS011012345678900210123456789033900011SG.COM.NETS01230201401832831128823590002150001118703240000308885872010901199084E5DC3D834430017COM.QQ.WEIXIN.PAY011012345678900204123435660010SG.COM.UOB014845D233507F5E8C306E3871A4E9FACA601A80C114B5645E5D36840009SG.PAYNOW010120216+621234567890123030100408209912310525123456789012345678901234537270009SG.AIRPAY0110A11BC0000X51860007SG.SGQR0112180307510317020701.0003030608100604020205031380609Counter010708201804075204581453037025802SG5916FOOD XYZ PTE LTD6009SINGAPORE6106081006626001081234567R0607876543050330015SG.COM.DASH.WWW0110000005550263045E8D";

    expect(parseAndValidateSGQR(sgqrPayload)).toStrictEqual({
      payloadFormatIndicator: "01",
      pointOfInitiationMethod: "11",
      merchantAccountInformation: {
        amex: ["1234567890", "312345678901234"],
        mastercard: ["512345678912345"],
        nets: {
          globallyUniqueIdentifier: "SG.COM.NETS",
          version: "0",
          qrIssuerUen: "2014018328",
          qrExpiryTimestamp: "311288235900",
          merchantId: "000111870324000",
          terminalId: "88587201",
          editableTxnAmountIndicator: true,
          qrType: undefined,
          signature: "4E5DC3D8",
        },
        paynow: {
          globallyUniqueIdentifier: "SG.PAYNOW",
          proxyType: "U",
          proxyValue: "+621234567890123",
          editableTxnAmountIndicator: false,
          reference: "1234567R",
          qrExpiryDate: "20991231",
        },
        unionpay: ["2500034400010344500034453110001"],
        visa: ["4761360000000*17"],
      },
      sgqrIdentityInformation: {
        uniqueIdentifier: "SG.SGQR",
        sgqrIdNumber: "180307510317",
        version: "01.0003",
        postalCode: "081006",
        levelNumber: "02",
        unitNumber: "138",
        miscellaneous: "Counter01",
        newVersionDate: "20180407",
      },
      merchantCategoryCode: "5814",
      transactionCurrency: "702",
      transactionAmount: undefined,
      tipOrConvenienceIndicator: undefined,
      valueOfConvenienceFeeFixed: undefined,
      valueOfConvenienceFeePercentage: undefined,
      countryCode: "SG",
      merchantName: "FOOD XYZ PTE LTD",
      merchantCity: "SINGAPORE",
      postalCode: "081006",
      additionalDataFieldTemplates: {
        billNumber: "1234567R",
        mobileNumber: undefined,
        storeLabel: undefined,
        loyaltyNumber: undefined,
        referenceLabel: undefined,
        customerLabel: "8765430",
        terminalLabel: undefined,
        purposeOfTransaction: undefined,
        additionalConsumerDataRequest: undefined,
        paymentSystemSpecificTemplates: {
          paynow: undefined,
          nets: undefined,
        },
      },
      merchantInformationLanguageTemplate: undefined,
      crc: "5E8D",
    });
  });
});
