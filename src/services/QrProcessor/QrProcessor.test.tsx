import { decodeAction, processQr } from "./index";
import demoEncrypted from "../../../fixtures/demo-encrypted-oc.json";
import demoOc from "../../../fixtures/demo-oc.json";

const dataPrefix = "https://action.openattestation.com?q=";

describe("decodeAction", () => {
  it("should throw on invalid protocols", () => {
    expect.assertions(2);
    expect(() => decodeAction("tradetrust://")).toThrow("Invalid QR Protocol");
    expect(() => decodeAction("%7B%22foo%22:%22bar%22%7D")).toThrow(
      "Invalid QR Protocol"
    );
  });

  it("should throw on invalid actions", () => {
    expect.assertions(2);
    expect(() =>
      decodeAction("https://action.openattestation.com?q=abc")
    ).toThrow("Invalid QR Action");
    expect(() =>
      decodeAction(
        "https://action.openattestation.com?q=%7B%22foo%22:%22bar%22%7D"
      )
    ).toThrow("Invalid QR Action");
  });

  describe("valid actions", () => {
    it("should return action for plaintext document", () => {
      expect.assertions(1);
      const input = `https://action.openattestation.com?q=%7B%22type%22:%22DOCUMENT%22,%22payload%22:%7B%22uri%22:%22https://hosted-document.com/doc/foo-bar%22%7D%7D`;
      const expectedAction = {
        type: "DOCUMENT",
        payload: {
          uri: "https://hosted-document.com/doc/foo-bar"
        }
      };
      expect(decodeAction(input)).toStrictEqual(expectedAction);
    });

    it("should return action for encrypted document", () => {
      expect.assertions(1);
      const input = `https://action.openattestation.com?q=%7B%22type%22:%22DOCUMENT%22,%22payload%22:%7B%22uri%22:%22https://hosted-document.com/doc/foo-bar%22,%22key%22:%22a0c820de75a302927c80b2c9b8a1143b8d519862d5ce972bdf0a76387464811b%22%7D%7D`;
      const expectedAction = {
        type: "DOCUMENT",
        payload: {
          uri: "https://hosted-document.com/doc/foo-bar",
          key:
            "a0c820de75a302927c80b2c9b8a1143b8d519862d5ce972bdf0a76387464811b"
        }
      };
      expect(decodeAction(input)).toStrictEqual(expectedAction);
    });

    it("should return action for encrypted document with permitted action and redirect", () => {
      expect.assertions(1);
      const action = {
        type: "DOCUMENT",
        payload: {
          uri: "https://hosted-document.com/doc/foo-bar",
          key:
            "a0c820de75a302927c80b2c9b8a1143b8d519862d5ce972bdf0a76387464811b",
          permittedActions: ["VIEW"],
          redirect: "https://tradetrust.io/"
        }
      };
      const input = `https://action.openattestation.com?q=%7B%22type%22:%22DOCUMENT%22,%22payload%22:%7B%22uri%22:%22https://hosted-document.com/doc/foo-bar%22,%22key%22:%22a0c820de75a302927c80b2c9b8a1143b8d519862d5ce972bdf0a76387464811b%22,%22permittedActions%22:%5B%22VIEW%22%5D,%22redirect%22:%22https://tradetrust.io/%22%7D%7D`;
      expect(decodeAction(input)).toStrictEqual(action);
    });
  });
});

describe("processQr", () => {
  const mockJsonResponse = jest.fn();

  beforeAll(() => {
    const globalAny: any = global;
    jest.spyOn(globalAny, "fetch").mockImplementation(async () => ({
      json: mockJsonResponse
    }));
  });

  it("should fetch and call `onDocumentView` for `document` type action", async () => {
    expect.assertions(2);
    mockJsonResponse.mockResolvedValue("MOCK_JSON_DOCUMENT");
    const onDocumentStore = jest.fn();
    const onDocumentView = jest.fn();
    await processQr(
      dataPrefix +
        encodeURI(
          JSON.stringify({
            type: "DOCUMENT",
            payload: { uri: "https://api.myjson.com/bins/kv1de" }
          })
        ),
      { onDocumentStore, onDocumentView }
    );
    expect(onDocumentView).toHaveBeenCalledWith("MOCK_JSON_DOCUMENT");
    expect(onDocumentStore).not.toHaveBeenCalled();
  });

  it("should fetch and call `onDocumentStore` for `document` type action with STORE", async () => {
    expect.assertions(2);
    mockJsonResponse.mockResolvedValue("MOCK_JSON_DOCUMENT");
    const onDocumentStore = jest.fn();
    const onDocumentView = jest.fn();
    await processQr(
      dataPrefix +
        encodeURI(
          JSON.stringify({
            type: "DOCUMENT",
            payload: {
              uri: "https://api.myjson.com/bins/kv1de",
              permittedActions: ["STORE"]
            }
          })
        ),
      { onDocumentStore, onDocumentView }
    );
    expect(onDocumentStore).toHaveBeenCalledWith("MOCK_JSON_DOCUMENT");
    expect(onDocumentView).not.toHaveBeenCalled();
  });

  it("should throw for unknown action types", async () => {
    expect.assertions(2);
    const onDocumentStore = jest.fn();
    const onDocumentView = jest.fn();
    await expect(
      processQr(
        dataPrefix +
          encodeURI(
            JSON.stringify({
              type: "COW",
              payload: { uri: "https://api.myjson.com/bins/kv1de" }
            })
          ),
        { onDocumentStore, onDocumentView }
      )
    ).rejects.toThrow("Invalid QR Action");
    expect(onDocumentView).not.toHaveBeenCalled();
  });

  it("should bubble errors from `onDocumentView` if it throws", async () => {
    expect.assertions(1);
    const onDocumentView = (): void => {
      throw new Error("Error from onDocumentStore");
    };
    const onDocumentStore = jest.fn();
    await expect(
      processQr(
        dataPrefix +
          encodeURI(
            JSON.stringify({
              type: "DOCUMENT",
              payload: { uri: "https://api.myjson.com/bins/kv1de" }
            })
          ),
        { onDocumentStore, onDocumentView }
      )
    ).rejects.toThrow("Error from onDocumentStore");
  });

  it("should bubble rejections from `onDocumentView` if it rejects", async () => {
    expect.assertions(1);
    const onDocumentView = (): Promise<void> =>
      Promise.reject(new Error("Error from onDocumentStore"));
    const onDocumentStore = jest.fn();
    await expect(
      processQr(
        dataPrefix +
          encodeURI(
            JSON.stringify({
              type: "DOCUMENT",
              payload: { uri: "https://api.myjson.com/bins/kv1de" }
            })
          ),
        { onDocumentStore, onDocumentView }
      )
    ).rejects.toThrow("Error from onDocumentStore");
  });

  it("should bubble errors from `onDocumentStore` if it throws", async () => {
    expect.assertions(1);
    const onDocumentStore = (): void => {
      throw new Error("Error from onDocumentStore");
    };
    const onDocumentView = jest.fn();
    await expect(
      processQr(
        dataPrefix +
          encodeURI(
            JSON.stringify({
              type: "DOCUMENT",
              payload: {
                uri: "https://api.myjson.com/bins/kv1de",
                permittedActions: ["STORE"]
              }
            })
          ),
        { onDocumentStore, onDocumentView }
      )
    ).rejects.toThrow("Error from onDocumentStore");
  });

  it("should bubble rejections from `onDocumentStore` if it rejects", async () => {
    expect.assertions(1);
    const onDocumentStore = (): Promise<void> =>
      Promise.reject(new Error("Error from onDocumentStore"));
    const onDocumentView = jest.fn();
    await expect(
      processQr(
        dataPrefix +
          encodeURI(
            JSON.stringify({
              type: "DOCUMENT",
              payload: {
                uri: "https://api.myjson.com/bins/kv1de",
                permittedActions: ["STORE"]
              }
            })
          ),
        { onDocumentStore, onDocumentView }
      )
    ).rejects.toThrow("Error from onDocumentStore");
  });

  it("should process encrypted document", async () => {
    expect.assertions(1);
    mockJsonResponse.mockResolvedValue(demoEncrypted);
    const onDocumentStore = jest.fn();
    const onDocumentView = jest.fn();
    await processQr(
      dataPrefix +
        encodeURI(
          JSON.stringify({
            type: "DOCUMENT",
            payload: {
              uri: "https://api.myjson.com/bins/kv1de",
              key:
                "a0c820de75a302927c80b2c9b8a1143b8d519862d5ce972bdf0a76387464811b"
            }
          })
        ),
      { onDocumentStore, onDocumentView }
    );
    expect(onDocumentView).toHaveBeenCalledWith(demoOc);
  });

  it("should throw on failed decryption", async () => {
    expect.assertions(1);
    mockJsonResponse.mockResolvedValue(demoEncrypted);
    const onDocumentStore = jest.fn();
    const onDocumentView = jest.fn();
    await expect(
      processQr(
        dataPrefix +
          encodeURI(
            JSON.stringify({
              type: "DOCUMENT",
              payload: {
                uri: "https://api.myjson.com/bins/kv1de",
                key:
                  "7e22da661c5d574ed611bf507db9350c5d50028df21fd7038fa0bb3b02e4e9b5"
              }
            })
          ),
        { onDocumentStore, onDocumentView }
      )
    ).rejects.toThrow("Error decrypting message");
  });
});
