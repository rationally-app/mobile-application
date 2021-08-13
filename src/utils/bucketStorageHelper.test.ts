import * as SecureStore from "expo-secure-store";
import {
  deleteStoreInBuckets,
  readFromStoreInBuckets,
  saveToStoreInBuckets,
} from "./bucketStorageHelper";

jest.mock("expo-secure-store");
const mockedSecureStore = SecureStore as jest.Mocked<typeof SecureStore>;
const mockSecureGetItem = mockedSecureStore.getItemAsync;
const mockSecureSetItem = mockedSecureStore.setItemAsync;
const mockSecureDeleteItem = mockedSecureStore.deleteItemAsync;

const testKey = "testkey";

const veryLongStringA = "A".repeat(1000);
const veryLongStringB = "B".repeat(1000);
const veryLongStringC = "C".repeat(1000);

describe("bucket storage helpers", () => {
  beforeEach(() => {
    mockSecureGetItem.mockReset();
    mockSecureSetItem.mockReset();
    mockSecureDeleteItem.mockReset();
  });

  describe("saveToStoreInBuckets", () => {
    it("should split up data into buckets according to the specified size", async () => {
      expect.assertions(4);

      const newData = JSON.stringify({
        key1: veryLongStringA,
        key2: veryLongStringB,
        key3: veryLongStringC,
        key4: veryLongStringA,
        key5: veryLongStringB,
      });

      await saveToStoreInBuckets(testKey, newData, null);
      expect(mockSecureSetItem).toHaveBeenCalledTimes(3);
      expect(mockSecureSetItem).toHaveBeenNthCalledWith(
        1,
        testKey + "_0",
        newData.slice(0, 2048)
      );
      expect(mockSecureSetItem).toHaveBeenNthCalledWith(
        2,
        testKey + "_1",
        newData.slice(2048, 4096)
      );
      expect(mockSecureSetItem).toHaveBeenNthCalledWith(
        3,
        testKey + "_2",
        newData.slice(4096, 6144)
      );
    });

    it("should only overwrite bucket 0 and 1 that has changes and not touch bucket 2", async () => {
      expect.assertions(3);

      const newData = JSON.stringify({
        key1: veryLongStringA,
        key2: veryLongStringB,
        key3: veryLongStringA,
        key4: veryLongStringB,
        key5: veryLongStringA,
      });
      const oldData = JSON.stringify({
        key1: veryLongStringA,
        key2: veryLongStringB,
        key3: veryLongStringC,
        key4: veryLongStringB,
        key5: veryLongStringA,
      });

      await saveToStoreInBuckets(testKey, newData, oldData);

      expect(mockSecureSetItem).toHaveBeenCalledTimes(2);
      expect(mockSecureSetItem).toHaveBeenNthCalledWith(
        1,
        testKey + "_0",
        newData.slice(0, 2048)
      );
      expect(mockSecureSetItem).toHaveBeenNthCalledWith(
        2,
        testKey + "_1",
        newData.slice(2048, 4096)
      );
    });

    it("should delete extra bucket 1 and 2", async () => {
      expect.assertions(5);

      const newData = JSON.stringify({
        key1: veryLongStringA,
        key5: veryLongStringA,
      });
      const oldData = JSON.stringify({
        key1: veryLongStringA,
        key2: veryLongStringB,
        key3: veryLongStringC,
        key4: veryLongStringB,
        key5: veryLongStringA,
      });

      await saveToStoreInBuckets(testKey, newData, oldData);
      expect(mockSecureSetItem).toHaveBeenCalledTimes(1);
      expect(mockSecureSetItem).toHaveBeenNthCalledWith(
        1,
        testKey + "_0",
        newData
      );
      expect(mockSecureDeleteItem).toHaveBeenCalledTimes(2);
      expect(mockSecureDeleteItem).toHaveBeenNthCalledWith(1, testKey + "_1");
      expect(mockSecureDeleteItem).toHaveBeenNthCalledWith(2, testKey + "_2");
    });

    it("should save empty strings and not ignore them", async () => {
      expect.assertions(3);

      await saveToStoreInBuckets(testKey, "", "a");

      expect(mockSecureSetItem).toHaveBeenCalledTimes(1);
      expect(mockSecureSetItem).toHaveBeenCalledWith(testKey + "_0", "");

      expect(mockSecureDeleteItem).not.toHaveBeenCalled();
    });
  });

  describe("readFromStoreInBuckets", () => {
    it("should read from all buckets and combine into one object", async () => {
      expect.assertions(5);

      const objectString = JSON.stringify({
        key1: {
          a: 1,
          b: 2,
        },
        key2: {
          a: 4,
          b: 5,
        },
        key3: {
          a: 9,
          b: 8,
        },
        key4: {
          a: 7,
          b: 6,
        },
      }); // length: 85

      mockSecureGetItem.mockResolvedValueOnce(objectString.slice(0, 40));
      mockSecureGetItem.mockResolvedValueOnce(objectString.slice(40, 85));
      mockSecureGetItem.mockResolvedValueOnce(null);

      const result = await readFromStoreInBuckets(testKey);
      expect(mockSecureGetItem).toHaveBeenCalledTimes(3);
      expect(mockSecureGetItem).toHaveBeenNthCalledWith(1, testKey + "_0");
      expect(mockSecureGetItem).toHaveBeenNthCalledWith(2, testKey + "_1");
      expect(mockSecureGetItem).toHaveBeenNthCalledWith(3, testKey + "_2");
      expect(result).toStrictEqual(
        JSON.stringify({
          key1: {
            a: 1,
            b: 2,
          },
          key2: {
            a: 4,
            b: 5,
          },
          key3: {
            a: 9,
            b: 8,
          },
          key4: {
            a: 7,
            b: 6,
          },
        })
      );
    });

    it("should return null if there is no data", async () => {
      expect.assertions(3);

      mockSecureGetItem.mockResolvedValueOnce(null);

      const result = await readFromStoreInBuckets(testKey);

      expect(mockSecureGetItem).toHaveBeenCalledTimes(1);
      expect(mockSecureGetItem).toHaveBeenNthCalledWith(1, testKey + "_0");
      expect(result).toBeNull();
    });

    it("should return an empty string and not ignore it", async () => {
      expect.assertions(4);

      mockSecureGetItem.mockResolvedValueOnce("");
      mockSecureGetItem.mockResolvedValueOnce(null);

      const result = await readFromStoreInBuckets(testKey);

      expect(mockSecureGetItem).toHaveBeenCalledTimes(2);
      expect(mockSecureGetItem).toHaveBeenNthCalledWith(1, testKey + "_0");
      expect(mockSecureGetItem).toHaveBeenNthCalledWith(2, testKey + "_1");
      expect(result).toStrictEqual("");
    });
  });

  describe("deleteInStoreInBuckets", () => {
    it("should delete all keys", async () => {
      expect.assertions(3);

      await deleteStoreInBuckets(
        testKey,
        veryLongStringA + veryLongStringB + veryLongStringC
      );

      expect(mockSecureDeleteItem).toHaveBeenCalledTimes(2);
      expect(mockSecureDeleteItem).toHaveBeenNthCalledWith(1, testKey + "_0");
      expect(mockSecureDeleteItem).toHaveBeenNthCalledWith(2, testKey + "_1");
    });

    it("should not do anything if old value is null", async () => {
      expect.assertions(1);

      await deleteStoreInBuckets(testKey, null);

      expect(mockSecureDeleteItem).not.toHaveBeenCalled();
    });

    it("should delete key if value is empty string", async () => {
      expect.assertions(2);

      await deleteStoreInBuckets(testKey, "");

      expect(mockSecureDeleteItem).toHaveBeenCalledTimes(1);
      expect(mockSecureDeleteItem).toHaveBeenNthCalledWith(1, testKey + "_0");
    });
  });
});
