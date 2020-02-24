import { STAGING_ENDPOINT, PRODUCTION_ENDPOINT, IS_MOCK } from "../../config";
import { AppMode } from "../../common/hooks/useConfig";

export interface Transaction {
  category: string;
  quantity: number;
}

export interface QuotaList {
  [key: string]: number;
}

export interface Quota {
  remainingQuota: QuotaList;
}

export interface PostTransaction {
  nric: string;
  transactions: Transaction[];
  key: string;
  mode: AppMode;
}

export interface PostTransactionResponse {
  transactions: Transaction[];
}

export const mockGetQuota = async (
  nric: string,
  _key: string,
  _mode: AppMode
): Promise<Quota> => {
  if (nric === "S0000000J") throw new Error("Something broke");
  return {
    remainingQuota: {
      "toilet-paper": 1000,
      "instant-noodles": 60,
      chocolate: 1
    }
  };
};

export const liveGetQuota = async (
  nric: string,
  key: string,
  mode: AppMode
): Promise<Quota> => {
  const endpoint =
    mode === AppMode.production ? PRODUCTION_ENDPOINT : STAGING_ENDPOINT;

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
  mode,
  key,
  transactions
}: PostTransaction): Promise<PostTransactionResponse> => {
  const endpoint =
    mode === AppMode.production ? PRODUCTION_ENDPOINT : STAGING_ENDPOINT;
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
