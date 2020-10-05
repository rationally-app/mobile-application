import { ERROR_MESSAGE } from "../context/alert";

const MERCHANT_CODE_REGEX = /^[a-zA-Z0-9]{1,8}$/;

export const validateMerchantCode = (merchantCode: string): boolean => {
  const merchantCodeArr = merchantCode.match(MERCHANT_CODE_REGEX);
  if (!merchantCodeArr) throw new Error(ERROR_MESSAGE.INVALID_MERCHANT_CODE);
  return true;
};
