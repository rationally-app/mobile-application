import { decodeAction, processQr } from "./QrProcessor";

const dataPrefix = "https://openattestation.com/action?document=";

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
      decodeAction("https://openattestation.com/action?document=abc")
    ).toThrow("Invalid QR Action");
    expect(() =>
      decodeAction(
        "https://openattestation.com/action?document=%7B%22foo%22:%22bar%22%7D"
      )
    ).toThrow("Invalid QR Action");
  });

  describe("valid actions", () => {
    it("should return action for plaintext document", () => {
      expect.assertions(1);
      const input = `https://openattestation.com/action?document=%7B%22uri%22:%22https://hosted-document.com/doc/foo-bar%22%7D`;
      const output = {
        payload: {
          uri: "https://hosted-document.com/doc/foo-bar"
        },
        type: "DOCUMENT"
      };
      expect(decodeAction(input)).toStrictEqual(output);
    });

    it("should return action for encrypted document", () => {
      expect.assertions(1);
      const input =
        "https://openattestation.com/action?document=%7B%22uri%22:%22https://hosted-document.com/doc/foo-bar%22,%22key%22:%22aa57eb519fd3c63c42c2f2697e8957198b56fc945c4db18b480c07d2e6485a93%22%7D";
      const action = {
        type: "DOCUMENT",
        payload: {
          uri: "https://hosted-document.com/doc/foo-bar",
          key:
            "aa57eb519fd3c63c42c2f2697e8957198b56fc945c4db18b480c07d2e6485a93"
        }
      };
      expect(decodeAction(input)).toStrictEqual(action);
    });

    it("should return action for encrypted document with permitted action and redirect", () => {
      expect.assertions(1);
      const input =
        "https://openattestation.com/action?document=%7B%22uri%22:%22https://hosted-document.com/doc/foo-bar%22,%22key%22:%22aa57eb519fd3c63c42c2f2697e8957198b56fc945c4db18b480c07d2e6485a93%22,%22permittedActions%22:%5B%22VIEW%22%5D,%22redirect%22:%22https://tradetrust.io/%22%7D";
      const action = {
        type: "DOCUMENT",
        payload: {
          uri: "https://hosted-document.com/doc/foo-bar",
          key:
            "aa57eb519fd3c63c42c2f2697e8957198b56fc945c4db18b480c07d2e6485a93",
          permittedActions: ["VIEW"],
          redirect: "https://tradetrust.io/"
        }
      };
      expect(decodeAction(input)).toStrictEqual(action);
    });
  });
});

describe("processQr", () => {
  const mockDocument = "MOCK_JSON_RESPONSE" as any;

  beforeAll(() => {
    const globalAny: any = global;
    jest
      .spyOn(globalAny, "fetch")
      .mockImplementation()
      .mockImplementation(async () => ({
        json: async () => mockDocument
      }));
  });

  it("should fetch and call `onDocumentView` for `document` type action", async () => {
    expect.assertions(2);
    const onDocumentStore = jest.fn();
    const onDocumentView = jest.fn();
    await processQr(
      dataPrefix +
        encodeURI(JSON.stringify({ uri: "https://api.myjson.com/bins/kv1de" })),
      { onDocumentStore, onDocumentView }
    );
    expect(onDocumentView).toHaveBeenCalledWith(mockDocument);
    expect(onDocumentStore).not.toHaveBeenCalled();
  });

  it("should fetch and call `onDocumentStore` for `document` type action with STORE", async () => {
    expect.assertions(2);
    const onDocumentStore = jest.fn();
    const onDocumentView = jest.fn();
    await processQr(
      dataPrefix +
        encodeURI(
          JSON.stringify({
            uri: "https://api.myjson.com/bins/kv1de",
            permittedActions: ["STORE"]
          })
        ),
      { onDocumentStore, onDocumentView }
    );
    expect(onDocumentStore).toHaveBeenCalledWith(mockDocument);
    expect(onDocumentView).not.toHaveBeenCalled();
  });

  it("should throw for unknown action types", async () => {
    expect.assertions(2);
    const onDocumentStore = jest.fn();
    const onDocumentView = jest.fn();
    await expect(
      processQr(
        "https://openattestation.com/action?cow=" +
          encodeURI(
            JSON.stringify({ uri: "https://api.myjson.com/bins/kv1de" })
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
            JSON.stringify({ uri: "https://api.myjson.com/bins/kv1de" })
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
            JSON.stringify({ uri: "https://api.myjson.com/bins/kv1de" })
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
              uri: "https://api.myjson.com/bins/kv1de",
              permittedActions: ["STORE"]
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
              uri: "https://api.myjson.com/bins/kv1de",
              permittedActions: ["STORE"]
            })
          ),
        { onDocumentStore, onDocumentView }
      )
    ).rejects.toThrow("Error from onDocumentStore");
  });
});
