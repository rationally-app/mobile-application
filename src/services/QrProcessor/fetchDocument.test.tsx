import {
  fetchEncryptedDocument,
  fetchCleartextDocument
} from "./fetchDocument";
import demoEncrypted from "../../../fixtures/demo-encrypted-oc.json";
import demoOc from "../../../fixtures/demo-oc.json";

const mockJsonResponse = jest.fn();

describe("fetchDocument", () => {
  beforeEach(() => {
    mockJsonResponse.mockReset();
    const globalAny: any = global;
    jest.spyOn(globalAny, "fetch").mockImplementation(async () => ({
      json: mockJsonResponse
    }));
  });

  describe("fetchCleartextDocument", () => {
    it("should fetch and return a cleartext document", async () => {
      expect.assertions(2);
      mockJsonResponse.mockResolvedValue(demoOc);
      const results = await fetchCleartextDocument({
        uri: "https://example.com/id"
      });
      expect(fetch).toHaveBeenCalledWith("https://example.com/id");
      expect(results).toStrictEqual(demoOc);
    });
  });

  describe("fetchEncryptedDocument", () => {
    it("should fetch and decrypt an encrypted document", async () => {
      expect.assertions(2);
      mockJsonResponse.mockResolvedValue(demoEncrypted);
      const results = await fetchEncryptedDocument({
        uri: "https://example.com/id",
        key: "a0c820de75a302927c80b2c9b8a1143b8d519862d5ce972bdf0a76387464811b"
      });
      expect(fetch).toHaveBeenCalledWith("https://example.com/id");
      expect(results).toStrictEqual(demoOc);
    });

    it("should throw on incorrect key", async () => {
      expect.assertions(2);
      mockJsonResponse.mockResolvedValue(demoEncrypted);
      expect(fetch).toHaveBeenCalledWith("https://example.com/id");
      await expect(
        fetchEncryptedDocument({
          uri: "https://example.com/id",
          key:
            "a0c820de75a302927c80b2c9b8a1143b8d519862d5ce972bdf0a76387464811a"
        })
      ).rejects.toThrow("Error decrypting message");
    });
  });
});
