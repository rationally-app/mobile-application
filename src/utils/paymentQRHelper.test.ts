import { findValueByKey } from "./paymentQRHelper";

describe("tests for paymentQRHelper", () => {
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
  });
});
