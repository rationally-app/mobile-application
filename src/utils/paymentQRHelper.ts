import { parseAndValidateSGQR } from "@rationally-app/payment-qr-parser";
import { PaymentQR } from "@rationally-app/payment-qr-parser/dist/paymentQr/types";
import { pick } from "lodash";
import { IdentifierInput, Transaction } from "../types";

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
 * Returns transaction identifiers updated using parsed payment QR payload values.
 *
 * Each transaction's identifiers contain identifiers with `textInputType` `PAYMENT_QR`, which
 * are payment QR payloads that shall be parsed.
 *
 * The parsed values are used to update identifiers where (1) `isOptional` is `true`, and (2)
 * their `label` matches a key in the parsed payment QR payload. Only identifiers in the same
 * transaction are updated.
 *
 * If no matching values are found, the value remains an empty string.
 *
 * @param transactions Array of transaction data
 */
export const getUpdatedTransactionsPaymentQRIdentifiers = (
  transactions: Array<Transaction>
): Array<Transaction> => {
  return transactions.map((transaction) => {
    const { identifierInputs } = transaction;
    let newIdentifierInputs: Array<IdentifierInput> | undefined;

    if (identifierInputs) {
      const paymentQRPayload = identifierInputs.find(
        ({ textInputType }) => textInputType === "PAYMENT_QR"
      )?.value;

      if (paymentQRPayload) {
        // TODO: Expand support for payment QRs
        // TODO: Perform preliminary parsing to determine payload type, then perform parsing
        const paymentQR = parseAndValidateSGQR(paymentQRPayload) as PaymentQR;
        // TODO: Use policy to filter supported payment rails
        paymentQR.merchantAccountInformation = pick(
          paymentQR.merchantAccountInformation,
          ["nets"]
        );

        const paymentQRRecords = paymentQR as Record<string, unknown>;

        newIdentifierInputs = identifierInputs.map((identifierInput, index) => {
          const { textInputType, isOptional, label, value } = identifierInput;
          let newValue: string = value;

          if (textInputType !== "PAYMENT_QR" && isOptional) {
            newValue = findValueByKey(label, paymentQRRecords) ?? value;
          }

          return { ...identifierInput, value: newValue };
        });
      }
    }

    return { ...transaction, identifierInputs: newIdentifierInputs };
  });
};
