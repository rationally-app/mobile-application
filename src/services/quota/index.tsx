import { STAGING_ENDPOINT, PRODUCTION_ENDPOINT } from "../../config";
import { AppMode } from "../../common/hooks/useConfig";

export interface Transaction {
  quantity: number;
  transactionTime: number;
}

export interface QuotaResponse {
  remainingQuota: number;
  history: Transaction[];
}

export const getQuota = async (
  nric: string,
  key: string,
  mode: AppMode
): Promise<QuotaResponse> => {
  const endpoint =
    mode === AppMode.production ? PRODUCTION_ENDPOINT : STAGING_ENDPOINT;

  const quotaResponse: QuotaResponse = await fetch(
    `${endpoint}/quota/${nric}`,
    {
      method: "GET",
      headers: {
        Authorization: key
      }
    }
  ).then(res => res.json());
  return quotaResponse;
};

export const postTransaction = async (
  nric: string,
  quantity: number,
  key: string,
  mode: AppMode
): Promise<Transaction[]> => {
  const endpoint =
    mode === AppMode.production ? PRODUCTION_ENDPOINT : STAGING_ENDPOINT;
  const quotaResponse: Transaction[] = await fetch(
    `${endpoint}/transactions/${nric}`,
    {
      method: "POST",
      headers: {
        Authorization: key
      },
      body: JSON.stringify({
        quantity
      })
    }
  ).then(res => res.json());
  return quotaResponse;
};
