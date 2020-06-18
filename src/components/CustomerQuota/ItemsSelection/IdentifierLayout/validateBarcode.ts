export const validateBarcode = (barcode: string): boolean => {
  return new RegExp(/^[0-9A-Za-z:]*$/).test(barcode);
};
