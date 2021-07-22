import * as SecureStore from "expo-secure-store";
import {
  readFromStoreInBuckets,
  saveToStoreInBuckets,
} from "./bucketStorageHelper";

jest.mock("expo-secure-store");
const mockedSecureStore = SecureStore as jest.Mocked<typeof SecureStore>;
const mockSecureGetItem = mockedSecureStore.getItemAsync;
const mockSecureSetItem = mockedSecureStore.setItemAsync;
const mockSecureDeleteItem = mockedSecureStore.deleteItemAsync;

const testkey = "testkey";

describe("bucket storage helpers", () => {
  beforeEach(() => {
    mockSecureGetItem.mockReset();
    mockSecureSetItem.mockReset();
    mockSecureDeleteItem.mockReset();
  });

  describe("saveToStoreInBuckets", () => {
    it("should split up data into buckets according to the specified size", async () => {
      expect.assertions(4);

      await saveToStoreInBuckets(
        testkey,
        {
          key1: "data1",
          key2: "data2",
          key3: "data3",
          key4: "data4",
          key5: "data5",
        },
        {},
        2
      );
      expect(mockSecureSetItem).toHaveBeenCalledTimes(3);
      expect(mockSecureSetItem).toHaveBeenNthCalledWith(
        1,
        testkey + "_0",
        JSON.stringify({
          key1: "data1",
          key2: "data2",
        })
      );
      expect(mockSecureSetItem).toHaveBeenNthCalledWith(
        2,
        testkey + "_1",
        JSON.stringify({
          key3: "data3",
          key4: "data4",
        })
      );
      expect(mockSecureSetItem).toHaveBeenNthCalledWith(
        3,
        testkey + "_2",
        JSON.stringify({
          key5: "data5",
        })
      );
    });

    it("should only overwrite buckets that have changes", async () => {
      expect.assertions(3);

      await saveToStoreInBuckets(
        testkey,
        {
          key1: 1,
          key2: 9,
          key3: 3,
          key4: 4,
          key5: 0,
        },
        {
          key1: 1,
          key2: 2,
          key3: 3,
          key4: 4,
          key5: 5,
        },
        2
      );

      expect(mockSecureSetItem).toHaveBeenCalledTimes(2);
      expect(mockSecureSetItem).toHaveBeenNthCalledWith(
        1,
        testkey + "_0",
        JSON.stringify({ key1: 1, key2: 9 })
      );
      expect(mockSecureSetItem).toHaveBeenNthCalledWith(
        2,
        testkey + "_2",
        JSON.stringify({
          key5: 0,
        })
      );
    });

    it("should delete extra buckets", async () => {
      expect.assertions(5);

      await saveToStoreInBuckets(
        testkey,
        {
          key1: [1],
          key5: [1, 2, 3, 4, 5],
        },
        {
          key1: [1],
          key2: [1, 2],
          key3: [1, 2, 3],
          key4: [1, 2, 3, 4],
          key5: [1, 2, 3, 4, 5],
        },
        2
      );
      expect(mockSecureSetItem).toHaveBeenCalledTimes(1);
      expect(mockSecureSetItem).toHaveBeenNthCalledWith(
        1,
        testkey + "_0",
        JSON.stringify({
          key1: [1],
          key5: [1, 2, 3, 4, 5],
        })
      );
      expect(mockSecureDeleteItem).toHaveBeenCalledTimes(2);
      expect(mockSecureDeleteItem).toHaveBeenNthCalledWith(1, testkey + "_1");
      expect(mockSecureDeleteItem).toHaveBeenNthCalledWith(2, testkey + "_2");
    });
  });

  describe("readFromStoreInBuckets", () => {
    it("should read from all buckets and combine into one object", async () => {
      expect.assertions(5);

      mockSecureGetItem.mockResolvedValueOnce(
        JSON.stringify({
          key1: {
            a: 1,
            b: 2,
          },
          key2: {
            a: 4,
            b: 5,
          },
        })
      );
      mockSecureGetItem.mockResolvedValueOnce(
        JSON.stringify({
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
      mockSecureGetItem.mockResolvedValueOnce(null);

      const result = await readFromStoreInBuckets(testkey);
      expect(mockSecureGetItem).toHaveBeenCalledTimes(3);
      expect(mockSecureGetItem).toHaveBeenNthCalledWith(1, testkey + "_0");
      expect(mockSecureGetItem).toHaveBeenNthCalledWith(2, testkey + "_1");
      expect(mockSecureGetItem).toHaveBeenNthCalledWith(3, testkey + "_2");
      expect(result).toStrictEqual({
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
      });
    });
  });
});
