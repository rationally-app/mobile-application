export interface Transaction {
  quantity: number;
  transactionTime: number;
}

export interface QuotaResponse {
  remainingQuota: number;
  history: Transaction[];
}

const wait = async (timeout: number): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, timeout);
  });
};

export const getQuota = async (
  nric: string,
  key: string
): Promise<QuotaResponse> => {
  // Mock implementation of get quota endpoint
  await wait(500);
  return {
    remainingQuota: 1,
    history: [
      {
        quantity: 5,
        transactionTime: 1580330434981
      }
    ]
  };
};

export const postTransaction = async (
  nric: string,
  quantity: number,
  key: string
): Promise<Transaction[]> => {
  // Mock implementation of post transaction endpoint
  await wait(500);
  return [
    {
      quantity: 5,
      transactionTime: 1580330642589
    }
  ];
};
