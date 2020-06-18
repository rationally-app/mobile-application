export const voucherCodeRegex = /^\d{9}$/;

export const validate = (voucherCode: string): boolean => {
  return voucherCode.match(voucherCodeRegex) !== null;
};

export const checkDuplicate = (
  voucherCode: string,
  voucherCodes: string[]
): boolean => {
  return voucherCodes.includes(voucherCode);
};

export const validateVoucherCode = (
  voucherCode: string,
  voucherCodes: string[]
): boolean => {
  const isValid = validate(voucherCode);
  if (!isValid) throw new Error("Invalid voucher code");
  const isDuplicate = checkDuplicate(voucherCode, voucherCodes);
  if (isDuplicate) throw new Error("Duplicate voucher code");
  return true;
};
