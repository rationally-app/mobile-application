import { IS_MOCK } from "../../config";
import {
  Transaction,
  Quota,
  PostTransactionResult,
  PastTransactionsResult,
  IdentificationFlag,
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
  apiVersion?: string;
}

export const mockGetQuota = async (
  ids: string[],
  _identificationFlag: IdentificationFlag,
  _key: string,
  _endpoint: string
): Promise<Quota> => {
  if (ids[0] === "S0000000J") throw new Error("Something broke");
  const transactionTime = new Date(2020, 3, 5);
  if (ids.length === 1) {
    return {
      remainingQuota: [
        {
          category: "toilet-paper",
          quantity: 0,
          transactionTime,
        },
        {
          category: "instant-noodles",
          quantity: 1,
          transactionTime,
        },
        {
          category: "chocolate",
          quantity: 30,
          transactionTime,
        },
        {
          category: "vouchers",
          quantity: 1,
          transactionTime,
        },
        {
          category: "voucher",
          quantity: 1,
          transactionTime,
        },
      ],
      globalQuota: [
        {
          category: "toilet-paper",
          quantity: 0,
          transactionTime,
        },
        {
          category: "instant-noodles",
          quantity: 1,
          transactionTime,
        },
        {
          category: "chocolate",
          quantity: 30,
          transactionTime,
        },
        {
          category: "vouchers",
          quantity: 1,
          transactionTime,
        },
        {
          category: "voucher",
          quantity: 1,
          transactionTime,
        },
      ],
      localQuota: [
        {
          category: "toilet-paper",
          quantity: Number.MAX_SAFE_INTEGER,
          transactionTime,
        },
        {
          category: "instant-noodles",
          quantity: Number.MAX_SAFE_INTEGER,
          transactionTime,
        },
        {
          category: "chocolate",
          quantity: Number.MAX_SAFE_INTEGER,
          transactionTime,
        },
        {
          category: "vouchers",
          quantity: Number.MAX_SAFE_INTEGER,
          transactionTime,
        },
        {
          category: "voucher",
          quantity: Number.MAX_SAFE_INTEGER,
          transactionTime,
        },
      ],
    };
  } else {
    return {
      remainingQuota: [
        {
          category: "toilet-paper",
          quantity: 2,
        },
        {
          category: "instant-noodles",
          quantity: 2,
        },
        {
          category: "chocolate",
          quantity: 60,
        },
        { category: "vouchers", quantity: 1 },
        { category: "voucher", quantity: 1 },
      ],
      globalQuota: [
        {
          category: "toilet-paper",
          quantity: 2,
        },
        {
          category: "instant-noodles",
          quantity: 2,
        },
        {
          category: "chocolate",
          quantity: 60,
        },
        { category: "vouchers", quantity: 1 },
        { category: "voucher", quantity: 1 },
      ],
      localQuota: [
        {
          category: "toilet-paper",
          quantity: Number.MAX_SAFE_INTEGER,
        },
        {
          category: "instant-noodles",
          quantity: Number.MAX_SAFE_INTEGER,
        },
        {
          category: "chocolate",
          quantity: Number.MAX_SAFE_INTEGER,
        },
        { category: "vouchers", quantity: Number.MAX_SAFE_INTEGER },
        { category: "voucher", quantity: Number.MAX_SAFE_INTEGER },
      ],
    };
  }
};

export const liveGetQuota = async (
  ids: string[],
  identificationFlag: IdentificationFlag,
  key: string,
  endpoint: string,
  apiVersion?: string
): Promise<Quota> => {
  let response;
  if (ids.length === 0) {
    throw new QuotaError("No ID was provided");
  }
  // format version with forward slash, to be added into endpoint, i.e. /v1, v2
  const version = apiVersion ? `/${apiVersion}` : "";

  try {
    response = await fetchWithValidator(Quota, `${endpoint}${version}/quota`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: key,
      },
      body: JSON.stringify({
        ids,
        identificationFlag,
      }),
    });
    return response;
  } catch (e) {
    if (e instanceof ValidationError) {
      Sentry.captureException(e);
    }
    // Currently the standalone mystique throws "User is not eligible" if not whitelisted,
    // however, the new eligibility check on our backend throw "id is not eligible"
    // This will be a current stop-gap measure to handle both types of eligibilty
    // As we move forward, we will move towards using the new eligibilty check and
    // phase out from the standalone mystique
    if (
      e.message === "User is not eligible" ||
      e.message === "id is not eligible"
    ) {
      throw new NotEligibleError(e.message);
    } else if (e instanceof SessionError) {
      throw e;
    }
    throw new QuotaError(e.message);
  }
};

export const mockPostTransaction = async ({
  ids,
  transactions,
}: PostTransaction): Promise<PostTransactionResult> => {
  if (ids[0] === "S0000000J") throw new Error("Something broke");
  const timestamp = new Date();
  if (transactions[0].category === "voucher") {
    const transactionArr = [];
    for (let i = 0; i < transactions[0].quantity; i++) {
      const transaction: Transaction[] = [
        {
          category: "voucher",
          quantity: 1,
        },
      ];
      transactionArr.push({
        timestamp: timestamp,
        transaction,
      });
    }
    return {
      transactions: transactionArr,
    };
  }
  return {
    transactions: [
      {
        transaction: transactions,
        timestamp,
      },
    ],
  };
};

export const livePostTransaction = async ({
  ids,
  identificationFlag,
  endpoint,
  key,
  transactions,
  apiVersion,
}: PostTransaction): Promise<PostTransactionResult> => {
  if (ids.length === 0) {
    throw new PostTransactionError("No ID was provided");
  }
  // format version with forward slash, to be added into endpoint, i.e. /v1
  const version = apiVersion ? `/${apiVersion}` : "";

  try {
    const response = await fetchWithValidator(
      PostTransactionResult,
      `${endpoint}${version}/transactions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: key,
        },
        body: JSON.stringify({
          ids,
          identificationFlag,
          transaction: transactions,
        }),
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
        transactionTime,
        identifierInputs: [
          {
            label: "toilet-paper label",
            value: `${"loremipsum".repeat(15)}`,
          },
        ],
      },
      {
        category: "instant-noodles",
        quantity: 1,
        transactionTime,
      },
      {
        category: "chocolate",
        quantity: 30,
        transactionTime,
      },
      {
        category: "vouchers",
        quantity: 5,
        transactionTime,
      },
      {
        category: "store",
        quantity: 1,
        transactionTime,
        identifierInputs: [
          {
            label: "store label",
            value: `${"loremipsum".repeat(15)}`,
          },
        ],
      },
    ],
  };
};

export const livePastTransactions = async (
  ids: string[],
  identificationFlag: IdentificationFlag,
  key: string,
  endpoint: string,
  categories?: string[],
  getAllTransactions = false,
  apiVersion?: string
): Promise<PastTransactionsResult> => {
  let response;
  if (ids.length === 0) {
    throw new PastTransactionError("No ID was provided");
  }
  // format version with forward slash, to be added into endpoint, i.e. /v1
  const version = apiVersion ? `/${apiVersion}` : "";

  try {
    response = await fetchWithValidator(
      PastTransactionsResult,
      `${endpoint}${version}/transactions/history`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: key,
        },
        body: JSON.stringify({
          ids,
          identificationFlag,
          getAllTransactions,
          categories,
        }),
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
