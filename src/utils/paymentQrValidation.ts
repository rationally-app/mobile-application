import { parsePaymentQR } from "@rationally-app/payment-qr-parser";
import { pick } from "lodash";
import { ERROR_MESSAGE } from "../context/alert";

export class PaymentQRDeformedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PaymentQRDeformedError";
  }
}

export class PaymentQRMissingInfoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PaymentQRMissingInfoError";
  }
}

export class UnsupportedPaymentQRError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnsupportedPaymentQRError";
  }
}

const isValidPaymentQR = (payload: string): boolean => {
  try {
    const paymentQR = parsePaymentQR(payload);
    const supportedPaymentMerchantAccounts = pick(
      paymentQR.merchantAccountInformation,
      ["nets"]
    );
    const isPaymentQRSupported = Object.values(
      supportedPaymentMerchantAccounts
    ).some((information) => information);

    if (!isPaymentQRSupported) {
      throw new Error(ERROR_MESSAGE.INVALID_IDENTIFIER_INPUT);
    }

    return isPaymentQRSupported;
  } catch (e) {
    if (e instanceof PaymentQRDeformedError) {
      throw new PaymentQRDeformedError(ERROR_MESSAGE.INVALID_IDENTIFIER_INPUT);
    } else if (e instanceof SGQRParseError) {
      throw new SGQRParseError(ERROR_MESSAGE.INVALID_IDENTIFIER_INPUT);
    } else if (e instanceof PaymentQRMissingInfoError) {
      throw new PaymentQRMissingInfoError(
        ERROR_MESSAGE.INVALID_IDENTIFIER_INPUT
      );
    }
    throw new Error(ERROR_MESSAGE.INVALID_IDENTIFIER_INPUT);
  }
};

export default isValidPaymentQR;
