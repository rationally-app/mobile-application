import { IS_MOCK } from "../../config";
import {
  Transaction,
  Quota,
  PostTransactionResult,
  PastTransactionsResult,
  IdentificationFlag
} from "../../types";
import { fetchWithValidator, ValidationError, SessionError } from "../helpers";
import { Sentry } from "../../utils/errorTracking";

export class NotEligibleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotEligibleError";
  }
}

export class QuotaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "QuotaError";
  }
}

export class PostTransactionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PostTransactionError";
  }
}

export class PastTransactionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PastTransactionError";
  }
}

interface PostTransaction {
  ids: string[];
  identificationFlag: IdentificationFlag;
  transactions: Transaction[];
  key: string;
  endpoint: string;
}

export const mockGetQuota = async (
  ids: string[],
  _identificationFlag: IdentificationFlag,
  _key: string,
  _endpoint: string
): Promise<Quota> => {
  if (ids[0] === "S0000000J") throw new Error("Something broke");
  if (ids.length === 1) {
    const transactionTime = new Date(2020, 3, 5);
    return {
      remainingQuota: [
        {
          category: "toilet-paper",
          quantity: 0,
          transactionTime
        },
        {
          category: "instant-noodles",
          quantity: 1,
          transactionTime
        },
        {
          category: "chocolate",
          quantity: 30,
          transactionTime
        },
        {
          category: "vouchers",
          quantity: 1,
          transactionTime
        },
        {
          category: "voucher",
          quantity: 1,
          transactionTime
        }
      ]
    };
  } else {
    return {
      remainingQuota: [
        {
          category: "toilet-paper",
          quantity: 2
        },
        {
          category: "instant-noodles",
          quantity: 2
        },
        {
          category: "chocolate",
          quantity: 60
        },
        { category: "vouchers", quantity: 1 },
        { category: "voucher", quantity: 1 }
      ]
    };
  }
};

export const liveGetQuota = async (
  ids: string[],
  identificationFlag: IdentificationFlag,
  key: string,
  endpoint: string
): Promise<Quota> => {
  let response;
  if (ids.length === 0) {
    throw new QuotaError("No ID was provided");
  }
  try {
    response = await fetchWithValidator(Quota, `${endpoint}/quota`, {
      method: "POST",
      headers: {
        Authorization: key
      },
      body: JSON.stringify({
        ids,
        identificationFlag
      })
    });
    return response;
  } catch (e) {
    if (e instanceof ValidationError) {
      Sentry.captureException(e);
    }
    if (e.message === "User is not eligible") {
      throw new NotEligibleError(e.message);
    } else if (e instanceof SessionError) {
      throw e;
    }
    throw new QuotaError(e.message);
  }
};

export const mockPostTransaction = async ({
  ids,
  transactions
}: PostTransaction): Promise<PostTransactionResult> => {
  if (ids[0] === "S0000000J") throw new Error("Something broke");
  const timestamp = new Date();
  if (transactions[0].category === "voucher") {
    const transactionArr = [];
    for (let i = 0; i < transactions[0].quantity; i++) {
      const transaction: Transaction[] = [
        {
          category: "voucher",
          quantity: 1
        }
      ];
      transactionArr.push({
        timestamp: timestamp,
        transaction
      });
    }
    return {
      transactions: transactionArr
    };
  }
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
  identificationFlag,
  endpoint,
  key,
  transactions
}: PostTransaction): Promise<PostTransactionResult> => {
  if (ids.length === 0) {
    throw new PostTransactionError("No ID was provided");
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
          identificationFlag,
          transaction: transactions
        })
      }
    );
    return response;
  } catch (e) {
    if (e instanceof ValidationError) {
      Sentry.captureException(e);
    } else if (e instanceof SessionError) {
      throw e;
    }
    throw new PostTransactionError(e.message);
  }
};

export const mockPastTransactions = async (
  ids: string[],
  _identificationFlag: IdentificationFlag,
  _key: string,
  _endpoint: string
): Promise<PastTransactionsResult> => {
  if (ids[0] === "S0000000J") throw new Error("Something broke");
  if (ids.length === 0) {
    throw new PastTransactionError("No ID was provided");
  }
  const transactionTime = new Date(2020, 3, 5);
  return {
    pastTransactions: [
      {
        category: "toilet-paper",
        quantity: 1,
        transactionTime
      },
      {
        category: "instant-noodles",
        quantity: 1,
        transactionTime
      },
      {
        category: "chocolate",
        quantity: 30,
        transactionTime
      },
      {
        category: "vouchers",
        quantity: 5,
        transactionTime
      }
    ]
  };
};

export const livePastTransactions = async (
  ids: string[],
  identificationFlag: IdentificationFlag,
  key: string,
  endpoint: string
): Promise<PastTransactionsResult> => {
  let response;
  if (ids.length === 0) {
    throw new PastTransactionError("No ID was provided");
  }
  try {
    response = await fetchWithValidator(
      PastTransactionsResult,
      `${endpoint}/transactions/history`,
      {
        method: "POST",
        headers: {
          Authorization: key
        },
        body: JSON.stringify({
          ids,
          identificationFlag
        })
      }
    );
    return response;
  } catch (e) {
    if (e instanceof ValidationError) {
      Sentry.captureException(e);
    } else if (e instanceof SessionError) {
      throw e;
    }
    throw new PastTransactionError(e.message);
  }
};

export const getQuota = IS_MOCK ? mockGetQuota : liveGetQuota;
export const postTransaction = IS_MOCK
  ? mockPostTransaction
  : livePostTransaction;
export const getPastTransactions = IS_MOCK
  ? mockPastTransactions
  : livePastTransactions;
