import { parseAndValidateSGQR } from "@rationally-app/payment-qr-parser";
import { Transaction } from "../types";

/**
 * Returns the value of the first element in the provided record key.
 * If the provided record key does not exist, `undefined` is returned.
 *
 * @param key Record key to locate
 * @param record Record containing keys and values
 * @returns Value in provided record key as `string` if found, otherwise `undefined`
 */
export const findValueByKey = (
  key: string,
  record: Record<string, unknown>
): string | undefined => {
  for (const k in record) {
    if (k === key) {
      return record[k] as string;
    }

    if (record[k] instanceof Object) {
      const result = findValueByKey(key, record[k] as Record<string, unknown>);

      if (result) {
        return result;
      }
    }
  }

  return undefined;
};

/**
 * Update transaction identifiers using parsed payment QR payload values.
 *
 * Each transaction's identifiers contain identifiers with `textInputType` `PAYMENT_QR`, which
 * are payment QR payloads that shall be parsed.
 *
 * The parsed values are used to update identifiers where (1) `isOptional` is `true`, and (2)
 * their `label` matches a key in the parsed payment QR payload. Only identifiers in the same
 * transaction are updated.
 *
 * @param transactions Array of transaction data
 */
export const updateTransactionsPaymentQRIdentifiers = (
  transactions: Array<Transaction>
): void => {
  transactions.forEach(({ identifierInputs }) => {
    if (identifierInputs) {
      const paymentQRPayload = identifierInputs.find(
        ({ textInputType }) => textInputType === "PAYMENT_QR"
      )?.value;

      if (paymentQRPayload) {
        // TODO: Expand support for payment QRs
        // TODO: Perform preliminary parsing to determine payload type, then perform parsing
        const paymentQRRecords = parseAndValidateSGQR(
          paymentQRPayload
        ) as Record<string, unknown>;

        identifierInputs.forEach(
          ({ textInputType, isOptional, label, value }, index) => {
            if (textInputType !== "PAYMENT_QR" && isOptional) {
              identifierInputs[index].value =
                findValueByKey(label, paymentQRRecords) ?? value;
            }
          }
        );
      }
    }
  });
};
