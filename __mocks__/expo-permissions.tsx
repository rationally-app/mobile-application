export const getAsync = jest.fn((permissions) => Promise.resolve());
export const askAsync = jest.fn((permissions) => {
  return Promise.resolve({ status: "granted" });
});
