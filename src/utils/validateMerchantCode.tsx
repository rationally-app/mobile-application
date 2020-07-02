export const merchantCodeRegex = /^[a-zA-Z0-9]{1,8}$/;

export const validateMerchantCode = (merchantCode: string): boolean => {
  const merchantCodeArr = merchantCode.match(merchantCodeRegex);
  if (!merchantCodeArr) throw new Error("Invalid merchant code");
  return true;
};
