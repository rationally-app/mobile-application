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

export class PaymentQRUnsupportedErrorTextDisabled extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "PaymentQRUnsupportedErrorTextDisabled";
  }
}

export class PaymentQRMissingInfoErrorDisabled extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "PaymentQRMissingInfoErrorDisabled";
  }
}

export class PaymentQRDeformedErrorTextDisabled extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "PaymentQRDeformedErrorTextDisabled";
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
      throw isTextInputDisabled
        ? new PaymentQRUnsupportedErrorTextDisabled(
            ERROR_MESSAGE.INVALID_IDENTIFIER_INPUT_TEXT_DISABLED
          )
        : new PaymentQRUnsupportedError(ERROR_MESSAGE.INVALID_IDENTIFIER_INPUT);
    } else if (e instanceof PaymentQRMissingInfoError) {
      throw isTextInputDisabled
        ? new PaymentQRMissingInfoErrorDisabled(
            ERROR_MESSAGE.INVALID_IDENTIFIER_INPUT_TEXT_DISABLED
          )
        : new PaymentQRMissingInfoError(ERROR_MESSAGE.INVALID_IDENTIFIER_INPUT);
    }

    throw isTextInputDisabled
      ? new PaymentQRDeformedErrorTextDisabled(
          ERROR_MESSAGE.INVALID_IDENTIFIER_INPUT_TEXT_DISABLED
        )
      : new PaymentQRDeformedError(ERROR_MESSAGE.INVALID_IDENTIFIER_INPUT);
  }
};

export default isValidPaymentQR;
