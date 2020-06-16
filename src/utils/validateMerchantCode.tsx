export const merchantCodeRegex = /^\d{9}$/;

export const validateMerchantCode = (merchantCode: string): boolean => {
    if (!merchantCode.match(merchantCodeRegex)) {
        return false;
    } 
    return true;
}