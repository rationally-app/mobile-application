import {
  parsePaymentQR,
  PaymentQRMissingInfoError,
  PaymentQRDeformedError,
} from "@rationally-app/payment-qr-parser";
import { pick } from "lodash";
import { ERROR_MESSAGE } from "../context/alert";
import { Sentry } from "./errorTracking";

export class PaymentQRUnsupportedError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "PaymentQRUnsupportedError";
  }
}

const isValidPaymentQR = (payload: string): boolean => {
  try {
    const paymentQR = parsePaymentQR(payload, {
      source: "MOBILE_APP_PAYMENT_QR_VALIDATION",
      checkExpiry: false,
    });
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
    Sentry.addBreadcrumb({
      category: "paymentQR",
      message: payload,
    });
    Sentry.captureException(e);

    if (e instanceof PaymentQRUnsupportedError) {
      throw new PaymentQRUnsupportedError(
        ERROR_MESSAGE.INVALID_IDENTIFIER_INPUT
      );
    } else if (e instanceof PaymentQRMissingInfoError) {
      throw new PaymentQRMissingInfoError(
        ERROR_MESSAGE.INVALID_IDENTIFIER_INPUT
      );
    }
    throw new PaymentQRDeformedError(ERROR_MESSAGE.INVALID_IDENTIFIER_INPUT);
  }
};

export default isValidPaymentQR;
