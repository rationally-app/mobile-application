// TODO: temporary hack because react-native currently does not have Promise.allSettled
// https://github.com/facebook/react-native/issues/30236
/**
 * Creates a Promise that is resolved with an array of results when all
 * of the provided Promises resolve or reject.
 * @param values An array of Promises.
 * @returns A new Promise.
 */
export const allSettled: <T>(
  values: Iterable<Promise<T>>
) => Promise<PromiseSettledResult<T>[]> = (promises) => {
  return Promise.all(
    Array.from(promises).map((promise) =>
      promise
        .then((value) => ({
          status: "fulfilled" as const,
          value,
        }))
        .catch((reason) => ({
          status: "rejected" as const,
          reason,
        }))
    )
  );
};
