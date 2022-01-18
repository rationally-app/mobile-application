import { parseAndValidateSGQR } from "@rationally-app/payment-qr-parser";
import { pick } from "lodash";

const paymentQrValidate = (paymentQr: string): boolean => {
  try {
    // TODO: Expand support for payment QRs
    const paymentQR = parseAndValidateSGQR(paymentQr);
    // TODO: Use policy to filter supported payment rails
    const supportedPaymentMerchantAccounts = pick(
      paymentQR.merchantAccountInformation,
      ["nets"]
    );
    const isPaymentQRSupported = Object.values(
      supportedPaymentMerchantAccounts
    ).some((information) => information);

    return isPaymentQRSupported;
  } catch (e) {
    return false;
  }
};

export default paymentQrValidate;
