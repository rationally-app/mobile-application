import { BarCodeEvent } from "expo-barcode-scanner";

export const extractPassportIdFromEvent = (event: BarCodeEvent): string => {
  let passportId;
  try {
    ({ passportId } = JSON.parse(event.data));
  } catch (e) {
    /**
     * If we encounter any JSON errors, we set `passportId` to empty
     * in order to allow logic below to handle it as an empty/invalid ID.
     *
     * However, any other errors will trigger the ErrorBoundary.
     */
    if (e instanceof SyntaxError) {
      return "";
    } else {
      throw e;
    }
  }
  // TODO: Enforce passportId type with io-ts
  return typeof passportId !== "string" ? "" : passportId;
};
