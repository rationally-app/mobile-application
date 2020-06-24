import { IS_MOCK } from "../../config";
import { fetchWithValidator, ValidationError } from "../helpers";
import { Voucher, Transaction, PostTransactionResult } from "../../types";
import * as Sentry from "sentry-expo";

export class NotEligibleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotEligibleError";
  }
}

export class InvalidVoucherError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidVocuherError";
  }
}

export class PostTransactionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PostTransactionError";
  }
}

interface PostTransaction {
  ids: string[];
  transactions: Transaction[];
  key: string;
  endpoint: string;
}

export const liveGetVoucherValidation = async (
  serial: string,
  key: string,
  endpoint: string
): Promise<Voucher> => {
  let response;
  try {
    response = await fetchWithValidator(
      Voucher,
      `${endpoint}/quota/${serial}`,
      {
        method: "GET",
        headers: {
          Authorization: key
        }
      }
    );
    return response;
  } catch (e) {
    if (e instanceof ValidationError) {
      Sentry.captureException(e);
    }
    if (e.message === "User is not eligible") {
      throw new NotEligibleError(e.message);
    }
    throw new InvalidVoucherError(e.message);
  }
};

export const mockGetVoucherValidation = async (
  serial: string,
  _key: string,
  _endpoint: string
): Promise<Voucher> => {
  console.log(serial);
  if (serial === "000000000") throw new InvalidVoucherError("Already redeemed");
  return {
    serial: serial,
    denomination: 2
  };
};

export const mockPostTransaction = async ({
  transactions
}: PostTransaction): Promise<PostTransactionResult> => {
  const timestamp = new Date();
  return {
    transactions: [
      {
        transaction: transactions,
        timestamp
      }
    ]
  };
};

export const livePostTransaction = async ({
  ids,
  transactions,
  endpoint,
  key
}: PostTransaction): Promise<PostTransactionResult> => {
  if (ids.length === 0) {
    throw new PostTransactionError("No Voucher Code was provided");
  }
  try {
    const response = await fetchWithValidator(
      PostTransactionResult,
      `${endpoint}/transactions`,
      {
        method: "POST",
        headers: {
          Authorization: key
        },
        body: JSON.stringify({
          ids,
          transaction: transactions
        })
      }
    );
    return response;
  } catch (e) {
    if (e instanceof ValidationError) {
      Sentry.captureException(e);
    }
    throw new PostTransactionError(e.message);
  }
};

export const getVoucherValidation = IS_MOCK
  ? mockGetVoucherValidation
  : liveGetVoucherValidation;
export const postTransaction = IS_MOCK
  ? mockPostTransaction
  : livePostTransaction;
