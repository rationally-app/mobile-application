import {
  parsePaymentQR,
  PaymentQRDeformedError,
  PaymentQRMissingInfoError,
  SGQRParseError,
} from "@rationally-app/payment-qr-parser";
import { pick } from "lodash";

const paymentQrValidate = (paymentQr: string): boolean => {
  try {
    const paymentQR = parsePaymentQR(paymentQr);
    const supportedPaymentMerchantAccounts = pick(
      paymentQR.merchantAccountInformation,
      ["nets"]
    );
    const isPaymentQRSupported = Object.values(
      supportedPaymentMerchantAccounts
    ).some((information) => information);

    return isPaymentQRSupported;
  } catch (e) {
    // TODO: Catch errors
    if (e instanceof PaymentQRDeformedError) {
      throw new PaymentQRDeformedError();
    } else if (e instanceof SGQRParseError) {
      throw new SGQRParseError();
    } else if (e instanceof PaymentQRMissingInfoError) {
      throw new PaymentQRMissingInfoError();
    }
    return false;
  }
};

export default paymentQrValidate;
