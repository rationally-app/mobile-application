const wait = async (timeout: number): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, timeout);
  });
};

export const authenticate = async (key: string): Promise<boolean> => {
  // Mock implementation of authentication endpoint
  await wait(500);
  return key !== "" ? true : false;
};
