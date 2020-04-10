import { IS_MOCK } from "../../config";

export interface QuotaItem {
  category: string;
  quantity: number;
  transactionTime?: number;
}

export interface Quota {
  remainingQuota: QuotaItem[];
}

export interface Transaction {
  category: string;
  quantity: number;
}

export interface PostTransaction {
  nrics: string[];
  transactions: Transaction[];
  key: string;
  endpoint: string;
}

export interface TransactionItemResponse {
  transaction: Transaction[];
  timestamp: number;
}

export interface PostTransactionResponse {
  transactions: TransactionItemResponse[];
}

export const mockGetQuota = async (
  nrics: string[],
  _key: string,
  _endpoint: string
): Promise<Quota> => {
  if (nrics[0] === "S0000000J") throw new Error("Something broke");
  return {
    remainingQuota: [
      {
        category: "toilet-paper",
        quantity: 2,
        transactionTime: 1586095465905
      },
      {
        category: "instant-noodles",
        quantity: 2,
        transactionTime: 1586095465905
      },
      { category: "chocolate", quantity: 30, transactionTime: 1586095465905 }
    ]
  };
};

export const liveGetQuota = async (
  nrics: string[],
  key: string,
  endpoint: string
): Promise<Quota> => {
  if (nrics.length === 1) {
    const quotaResponse: Quota = await fetch(`${endpoint}/quota/${nrics[0]}`, {
      method: "GET",
      headers: {
        Authorization: key
      }
    }).then(res => res.json());
    return quotaResponse;
  } else {
    const batchQuotaResponse: Quota = await fetch(`${endpoint}/quota`, {
      method: "POST",
      headers: {
        Authorization: key
      },
      body: JSON.stringify({
        ids: nrics
      })
    }).then(res => res.json());
    return batchQuotaResponse;
  }
};

export const mockPostTransaction = async ({
  nrics,
  transactions
}: PostTransaction): Promise<PostTransactionResponse> => {
  if (nrics[0] === "S0000000J") throw new Error("Something broke");
  const timestamp = new Date().getTime();
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
  nrics,
  endpoint,
  key,
  transactions
}: PostTransaction): Promise<PostTransactionResponse> => {
  const quotaResponse: PostTransactionResponse = await fetch(
    `${endpoint}/transactions`,
    {
      method: "POST",
      headers: {
        Authorization: key
      },
      body: JSON.stringify({
        ids: nrics,
        transaction: transactions
      })
    }
  ).then(res => res.json());
  return quotaResponse;
};

export const getQuota = IS_MOCK ? mockGetQuota : liveGetQuota;
export const postTransaction = IS_MOCK
  ? mockPostTransaction
  : livePostTransaction;
