export const voucherCodeRegex = /^\d{9}$/;
const maxNumVouchersPerTransaction = 200;

export const validate = (voucherCode: string): boolean => {
  return voucherCode.match(voucherCodeRegex) !== null;
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
  lengthOfVoucherCodes: number,
  limit = maxNumVouchersPerTransaction
): boolean => {
  return lengthOfVoucherCodes > limit;
};

export const validateVoucherCode = (
  voucherCode: string,
  voucherCodes: string[]
): boolean => {
  const hasReachedLimit = checkLimitReached(voucherCodes.length + 1);
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
