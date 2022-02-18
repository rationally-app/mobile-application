import {
  sgqrInvalidRazerPay,
  sgqrInvalidSupportedMerchantAccount,
  sgqrNETSQRPayload,
} from "@rationally-app/payment-qr-parser";
import { ERROR_MESSAGE } from "../context/alert";
import isValidPaymentQR, { PaymentQRError } from "./paymentQrValidation";

describe("isValidPaymentQR Test", () => {
  it("should parse SGQR payload properly", () => {
    expect.assertions(1);
    const validPayload = sgqrNETSQRPayload;
    expect(isValidPaymentQR(validPayload)).toBe(true);
  });
});

describe("tests for errors thrown during isValidPaymentQR", () => {
  it("should throw error when parsing deformed payment QR payload", () => {
    expect.assertions(2);
    const deformedPaymentQRPayload = "deformedPayload";
    expect(() => isValidPaymentQR(deformedPaymentQRPayload)).toThrow(
      new PaymentQRError(ERROR_MESSAGE.PAYMENT_QR_DEFORMED)
    );
    expect(() => isValidPaymentQR(deformedPaymentQRPayload, true)).toThrow(
      new PaymentQRError(ERROR_MESSAGE.PAYMENT_QR_DEFORMED_TEXT_DISABLED)
    );
  });

  it("should throw error when parsing invalid SGQR payload", () => {
    expect.assertions(2);
    const invalidSGQRPayload = sgqrNETSQRPayload.substring(
      0,
      sgqrNETSQRPayload.length - 1
    );
    expect(() => isValidPaymentQR(invalidSGQRPayload)).toThrow(
      new PaymentQRError(ERROR_MESSAGE.PAYMENT_QR_DEFORMED)
    );
    expect(() => isValidPaymentQR(invalidSGQRPayload, true)).toThrow(
      new PaymentQRError(ERROR_MESSAGE.PAYMENT_QR_DEFORMED_TEXT_DISABLED)
    );
  });

  it("should throw error when parsing SGQR payload with missing info", () => {
    expect.assertions(2);
    const missingInfoSGQRPayload = sgqrInvalidSupportedMerchantAccount;
    expect(() => isValidPaymentQR(missingInfoSGQRPayload)).toThrow(
      new PaymentQRError(ERROR_MESSAGE.PAYMENT_QR_MISSING)
    );
    expect(() => isValidPaymentQR(missingInfoSGQRPayload, true)).toThrow(
      new PaymentQRError(ERROR_MESSAGE.PAYMENT_QR_MISSING_TEXT_DISABLED)
    );
  });

  it("should throw error when parsing payment QR payload without NETS", () => {
    expect.assertions(2);
    const payloadWithoutNETS = sgqrInvalidRazerPay;
    expect(() => isValidPaymentQR(payloadWithoutNETS)).toThrow(
      new PaymentQRError(ERROR_MESSAGE.PAYMENT_QR_UNSUPPORTED)
    );
    expect(() => isValidPaymentQR(payloadWithoutNETS, true)).toThrow(
      new PaymentQRError(ERROR_MESSAGE.PAYMENT_QR_UNSUPPORTED_TEXT_DISABLED)
    );
  });
});
