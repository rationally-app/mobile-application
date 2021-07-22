import * as SecureStore from "expo-secure-store";

/** size limit of each entry in SecureStore in bytes */
const SIZE_LIMIT = 2048;

/**
 * Saves a string to SecureStore, respecting the
 * [2048 size limit](https://docs.expo.io/versions/v42.0.0/sdk/securestore/)
 * by splitting the serialised string up and saving it under multiple keys.
 *
 * The string to be saved is split into buckets (substring), with each bucket
 * not exceeding the size limit. Each bucket is then saved under it's own key
 * in SecureStore, starting with "{@link storageKey}_0" and then overflowing
 * into "{@link storageKey}_1", "*_2", etc.
 *
 * Each bucket is compared with the original value at the bucket (based on
 * {@link oldValue}) and only buckets that have changed are updated, the rest
 * are left untouched.
 * If {@link newValue} takes up less buckets than {@link oldValue}, extra
 * buckets are deleted from SecureStore.
 * The exception for the first bucket is that an empty string is counted as
 * data and will be stored in the first bucket instead of deleting it,
 * differentiating an empty string from no data.
 *
 * Note that the function does not read the existing value stored and takes
 * reference from {@link oldValue} instead.
 *
 * All storage calls are done asynchronously without blocking the caller.
 *
 * @param newValue new value to be stored
 * @param oldValue previous value stored
 * @param bucketSize number of keys per bucket
 * @param storageKey key to be used for storing
 */
export const saveToStoreInBuckets: (
  storageKey: string,
  newValue: string,
  oldValue: string | null
) => void = (storageKey, newValue, oldValue) => {
  oldValue = oldValue ?? "";

  // iterate the longer length in case we have to clear buckets
  const compareLength = Math.max(newValue.length, oldValue.length);
  for (let bucketNo = 0; bucketNo * SIZE_LIMIT < compareLength; bucketNo++) {
    const newValueBucketString = newValue.slice(
      bucketNo * SIZE_LIMIT,
      (bucketNo + 1) * SIZE_LIMIT
    );
    const oldValueBucketString = oldValue.slice(
      bucketNo * SIZE_LIMIT,
      (bucketNo + 1) * SIZE_LIMIT
    );

    if (newValueBucketString !== oldValueBucketString) {
      if (newValueBucketString === "" && bucketNo !== 0) {
        // if the new bucket is empty, delete the key
        // however, if this is the first bucket, user is saving an empty string, so do not delete
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
 * An empty string will be counted as data. This differentiates it from no data.
 *
 * @param storageKey key used in storage
 * @returns the value of the data in storage, null if there was no data found
 */
export const readFromStoreInBuckets: (
  storageKey: string
) => Promise<string | null> = async (storageKey) => {
  let bucketNo = 0;
  let storageData: string | null = null;
  while (true) {
    const newValueBucketString = await SecureStore.getItemAsync(
      storageKey + "_" + bucketNo
    );
    if (newValueBucketString === undefined) {
      // this shouldn't happen unless SecureStore is mocked with no implementation
      throw new Error(
        "unexpected undefined here, you probably should mock SecureStore"
      );
    }

    if (newValueBucketString === null) {
      return storageData;
    } else if (storageData === null) {
      storageData = "";
    }
    storageData += newValueBucketString;
    bucketNo++;
  }
};

/**
 * Deletes all buckets from storage. The number of existing buckets is determined by
 * the length of {@link oldValue}.
 *
 * @param storageKey key used in storage
 * @param oldValue existing value in storage
 */
export const deleteInStoreInBuckets: (
  storageKey: string,
  oldValue: string | null
) => Promise<void> = async (storageKey, oldValue) => {
  if (oldValue === null) {
    return;
  }
  const bucketCount = Math.max(1, Math.ceil(oldValue.length / SIZE_LIMIT));
  for (let bucketNo = 0; bucketNo < bucketCount; bucketNo++) {
    SecureStore.deleteItemAsync(storageKey + "_" + bucketNo);
  }
};
