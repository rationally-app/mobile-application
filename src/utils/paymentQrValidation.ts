import {
  parsePaymentQR,
  PaymentQRDeformedError,
  PaymentQRMissingInfoError,
  SGQRParseError,
} from "@rationally-app/payment-qr-parser";
import { pick } from "lodash";
import { ERROR_MESSAGE } from "../context/alert";

const paymentQrValidate = (payload: string): boolean => {
  try {
    const paymentQR = parsePaymentQR(payload);
    const supportedPaymentMerchantAccounts = pick(
      paymentQR.merchantAccountInformation,
      ["nets"]
    );
    const isPaymentQRSupported = Object.values(
      supportedPaymentMerchantAccounts
    ).some((information) => information);

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

export default paymentQrValidate;
