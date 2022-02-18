import {
  parsePaymentQR,
  PaymentQRMissingInfoError,
} from "@rationally-app/payment-qr-parser";
import { pick } from "lodash";
import { ERROR_MESSAGE } from "../context/alert";
import { Sentry } from "./errorTracking";

export class PaymentQRError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "PaymentQRError";
  }
}

class PaymentQRUnsupportedError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "PaymentQRUnsupportedError";
  }
}

const isValidPaymentQR = (
  payload: string,
  isTextInputDisabled?: boolean
): boolean => {
  try {
    const paymentQR = parsePaymentQR(payload, {
      source: "PAYMENT_QR_IS_VALID",
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
      throw new PaymentQRError(
        isTextInputDisabled
          ? ERROR_MESSAGE.PAYMENT_QR_UNSUPPORTED_TEXT_DISABLED
          : ERROR_MESSAGE.PAYMENT_QR_UNSUPPORTED
      );
    } else if (e instanceof PaymentQRMissingInfoError) {
      throw new PaymentQRError(
        isTextInputDisabled
          ? ERROR_MESSAGE.PAYMENT_QR_MISSING_TEXT_DISABLED
          : ERROR_MESSAGE.PAYMENT_QR_MISSING
      );
    }
    throw new PaymentQRError(
      isTextInputDisabled
        ? ERROR_MESSAGE.PAYMENT_QR_DEFORMED_TEXT_DISABLED
        : ERROR_MESSAGE.PAYMENT_QR_DEFORMED
    );
  }
};

export default isValidPaymentQR;
