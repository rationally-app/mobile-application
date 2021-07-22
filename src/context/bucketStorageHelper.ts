import * as SecureStore from "expo-secure-store";

/**
 * Compares old and new credential maps and saves changes to the store. Only
 * updates buckets that have changes.
 * @param newValue new value to be stored
 * @param oldValue previous value stored
 * @param bucketSize number of keys per bucket
 * @param storageKey key to be used for storing
 */
export const saveToStoreInBuckets: <T>(
  storageKey: string,
  newValue: Record<string, T>,
  oldValue: Record<string, T>,
  bucketSize: number
) => void = (storageKey, newValue, oldValue, bucketSize) => {
  const newValueEntries = Object.entries(newValue); // list of new value entries
  const oldValueEntries = Object.entries(oldValue); // list of prev credentials
  // iterate the longer length in case we have to clear buckets
  const credentialsCount = Math.max(
    newValueEntries.length,
    oldValueEntries.length
  );

  for (let i = 0; i < credentialsCount; i += bucketSize) {
    const newValueBucketString = JSON.stringify(
      Object.fromEntries(newValueEntries.splice(i, i + bucketSize))
    );
    const oldValueBucketString = JSON.stringify(
      Object.fromEntries(oldValueEntries.splice(i, i + bucketSize))
    );

    if (newValueBucketString !== oldValueBucketString) {
      const bucketNo = Math.floor(i / bucketSize);
      if (newValueBucketString === "{}") {
        // if the new bucket is empty, delete the key
        SecureStore.deleteItemAsync(storageKey + "_" + bucketNo);
      } else {
        SecureStore.setItemAsync(
          storageKey + "_" + bucketNo,
          newValueBucketString
        );
      }
    }
  }
};

/**
 * Reads data from storage in buckets and returns it. If no data was read, returns null.
 * @param storageKey Key used in storage
 * @returns the value of the data in storage, null if there was no data found
 */
export const readFromStoreInBuckets: <T>(
  storageKey: string
) => Promise<Record<string, T> | null> = async <T>(storageKey: string) => {
  let bucketNo = 0;
  let storageData: Record<string, T> | null = null;
  while (true) {
    const newValueBucketString = await SecureStore.getItemAsync(
      storageKey + "_" + bucketNo
    );
    if (newValueBucketString === null) {
      return storageData;
    } else if (storageData === null) {
      storageData = {};
    }
    const valueFromStoreBucket: Record<string, T> = JSON.parse(
      newValueBucketString
    );
    storageData = {
      ...storageData,
      ...valueFromStoreBucket,
    };
    bucketNo++;
  }
};
