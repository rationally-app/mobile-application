import {
  PaymentQRDeformedError,
  PaymentQRMissingInfoError,
  sgqrInvalidRazerPay,
  sgqrInvalidSupportedMerchantAccount,
  sgqrNETSQRPayload,
} from "@rationally-app/payment-qr-parser";
import { ERROR_MESSAGE } from "../context/alert";
import isValidPaymentQR, {
  PaymentQRUnsupportedError,
} from "./paymentQrValidation";

describe("isValidPaymentQR Test", () => {
  it("should parse SGQR payload properly", () => {
    expect.assertions(1);
    const validPayload = sgqrNETSQRPayload;
    expect(isValidPaymentQR(validPayload)).toBe(true);
  });
});

describe("tests for errors thrown during isValidPaymentQR", () => {
  it("should throw error when parsing deformed payment QR payload", () => {
    expect.assertions(1);
    const deformedPaymentQRPayload = "deformedPayload";
    expect(() => isValidPaymentQR(deformedPaymentQRPayload)).toThrow(
      new PaymentQRDeformedError(ERROR_MESSAGE.INVALID_IDENTIFIER_INPUT)
    );
  });

  it("should throw error when parsing invalid SGQR payload", () => {
    expect.assertions(1);
    const invalidSGQRPayload = sgqrNETSQRPayload.substring(
      0,
      sgqrNETSQRPayload.length - 1
    );
    expect(() => isValidPaymentQR(invalidSGQRPayload)).toThrow(
      new PaymentQRDeformedError(ERROR_MESSAGE.INVALID_IDENTIFIER_INPUT)
    );
  });

  it("should throw error when parsing SGQR payload with missing info", () => {
    expect.assertions(1);
    const missingInfoSGQRPayload = sgqrInvalidSupportedMerchantAccount;
    expect(() => isValidPaymentQR(missingInfoSGQRPayload)).toThrow(
      new PaymentQRMissingInfoError(ERROR_MESSAGE.INVALID_IDENTIFIER_INPUT)
    );
  });

  it("should throw error when parsing payment QR payload without NETS", () => {
    expect.assertions(1);
    const payloadWithoutNETS = sgqrInvalidRazerPay;
    expect(() => isValidPaymentQR(payloadWithoutNETS)).toThrow(
      new PaymentQRUnsupportedError(ERROR_MESSAGE.INVALID_IDENTIFIER_INPUT)
    );
  });
});
