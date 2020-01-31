import { ENDPOINT } from "../../config";

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
  key: string
): Promise<QuotaResponse> => {
  const quotaResponse: QuotaResponse = await fetch(
    `${ENDPOINT}/quota/${nric}`,
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
  key: string
): Promise<Transaction[]> => {
  console.log(nric, quantity, key);
  const quotaResponse: Transaction[] = await fetch(
    `${ENDPOINT}/transactions/${nric}`,
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
