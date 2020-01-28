import { uploadDocument } from "./index";
import { NetworkTypes } from "../../types";
const mockJsonResponse = jest.fn();
const mockFetch = jest.fn();

let dateMock: any;

describe("uploadDocument", () => {
  beforeAll(() => {
    dateMock = jest
      .spyOn(Date, "now")
      .mockImplementation(() => new Date(2020, 0, 1).getTime());
  });

  beforeEach(() => {
    mockJsonResponse.mockReset();
    const globalAny: any = global;
    jest.spyOn(globalAny, "fetch").mockImplementation(async () => ({
      json: mockJsonResponse,
      default: mockFetch
    }));
  });

  afterAll(() => {
    dateMock.mockRestore();
  });

  it("should return the correct qr code", async () => {
    expect.assertions(1);
    const document: any = "SAMPLE_DOCUMENT";
    const expiry = Date.now() + 30000;
    mockJsonResponse.mockResolvedValue({
      id: "DOCUMENT-ID",
      key: "SECRET-KEY",
      ttl: expiry
    });
    const qrCode = await uploadDocument(document, NetworkTypes.ropsten, 30000);
    expect(qrCode).toStrictEqual({
      url:
        "https://openattestation.com/action?document=%7B%22uri%22:%22https://api-ropsten.opencerts.io/storage/DOCUMENT-ID%22,%22key%22:%22SECRET-KEY%22%7D",
      expiry
    });
  });

  it("should throw if the request fail", async () => {
    expect.assertions(1);
    const document: any = "SAMPLE_DOCUMENT";
    mockJsonResponse.mockRejectedValue(new Error("TEST_ERROR"));
    await expect(
      uploadDocument(document, NetworkTypes.ropsten)
    ).rejects.toThrow("TEST_ERROR");
  });
});
