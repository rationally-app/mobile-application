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

export class PaymentQRUnsupportedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PaymentQRUnsupportedError";
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
      throw new PaymentQRUnsupportedError(
        ERROR_MESSAGE.INVALID_IDENTIFIER_INPUT
      );
    }

    return isPaymentQRSupported;
  } catch (e: any) {
    if (
      e.name === "PaymentQRDeformedError" ||
      e.name === "SGQRParseError" ||
      e.name === "NETSQRParseError"
    ) {
      throw new PaymentQRDeformedError(ERROR_MESSAGE.INVALID_IDENTIFIER_INPUT);
    } else if (e.name === "PaymentQRMissingInfoError") {
      throw new PaymentQRMissingInfoError(
        ERROR_MESSAGE.INVALID_IDENTIFIER_INPUT
      );
    }
    throw new PaymentQRUnsupportedError(ERROR_MESSAGE.INVALID_IDENTIFIER_INPUT);
  }
};

export default isValidPaymentQR;
