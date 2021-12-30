import { parseAndValidateSGQR } from "@rationally-app/payment-qr-parser";

const paymentQrValidate = (paymentQr: string): boolean => {
  try {
    parseAndValidateSGQR(paymentQr);
  } catch (e) {
    return false;
  }
  return true;
};

export default paymentQrValidate;
