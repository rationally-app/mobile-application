const VOUCHER_CODE_REGEX = /^\d{9}$/;
const MAX_NUM_VOUCHERS_PER_TRANSACTION = 200;

export const validate = (voucherCode: string): boolean => {
  return voucherCode.match(VOUCHER_CODE_REGEX) !== null;
};

export const checkDuplicate = (
  voucherCode: string,
  voucherCodes: string[]
): boolean => {
  return voucherCodes.includes(voucherCode);
};

export class LimitReachedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LimitReachedError";
  }
}

export const checkLimitReached = (
  voucherCodes: string[],
  limit = MAX_NUM_VOUCHERS_PER_TRANSACTION
): boolean => {
  return voucherCodes.length >= limit;
};

export const validateVoucherCode = (
  voucherCode: string,
  voucherCodes: string[]
): boolean => {
  const hasReachedLimit = checkLimitReached(voucherCodes);
  if (hasReachedLimit)
    throw new LimitReachedError(
      "Please checkout this batch of vouchers and resume in the next scan"
    );

  const isValid = validate(voucherCode);
  if (!isValid)
    throw new Error(
      "Please check that the voucher code is in the correct format"
    );

  const isDuplicate = checkDuplicate(voucherCode, voucherCodes);
  if (isDuplicate) throw new Error("Please scan a different voucher code");
  return true;
};
