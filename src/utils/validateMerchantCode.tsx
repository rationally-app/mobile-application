export const merchantCodeRegex = /^\d{9}$/;

export const validateMerchantCode = (merchantCode: string): boolean => {
  const merchantCodeArr = merchantCode.match(merchantCodeRegex);
  if (!merchantCodeArr) throw new Error("Invalid merchant code");
  return true;
};
