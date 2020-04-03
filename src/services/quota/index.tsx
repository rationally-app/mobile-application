import { IS_MOCK } from "../../config";

export interface Transaction {
  category: string;
  quantity: number;
}

export interface Quota {
  remainingQuota: Transaction[];
}

export interface PostTransaction {
  nric: string;
  transactions: Transaction[];
  key: string;
  endpoint: string;
}

export interface PostTransactionResponse {
  transactions: Transaction[];
}

export const mockGetQuota = async (
  nric: string,
  _key: string,
  _endpoint: string
): Promise<Quota> => {
  if (nric === "S0000000J") throw new Error("Something broke");
  return {
    remainingQuota: [
      { category: "toilet-paper", quantity: 1000 },
      { category: "instant-noodles", quantity: 60 },
      { category: "chocolate", quantity: 1 }
    ]
  };
};

export const liveGetQuota = async (
  nric: string,
  key: string,
  endpoint: string
): Promise<Quota> => {
  const quotaResponse: Quota = await fetch(`${endpoint}/quota/${nric}`, {
    method: "GET",
    headers: {
      Authorization: key
    }
  }).then(res => res.json());
  return quotaResponse;
};

export const mockPostTransaction = async ({
  nric,
  transactions
}: PostTransaction): Promise<PostTransactionResponse> => {
  if (nric === "S0000000J") throw new Error("Something broke");
  return {
    transactions
  };
};

export const livePostTransaction = async ({
  nric,
  endpoint,
  key,
  transactions
}: PostTransaction): Promise<PostTransactionResponse> => {
  const quotaResponse: PostTransactionResponse = await fetch(
    `${endpoint}/transactions/${nric}`,
    {
      method: "POST",
      headers: {
        Authorization: key
      },
      body: JSON.stringify(transactions)
    }
  ).then(res => res.json());
  return quotaResponse;
};

export const getQuota = IS_MOCK ? mockGetQuota : liveGetQuota;
export const postTransaction = IS_MOCK
  ? mockPostTransaction
  : livePostTransaction;
