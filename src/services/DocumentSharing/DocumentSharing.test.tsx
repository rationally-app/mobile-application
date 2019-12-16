import { uploadDocument } from "./index";

const mockJsonResponse = jest.fn();
const mockFetch = jest.fn();

describe("uploadDocument", () => {
  beforeEach(() => {
    mockJsonResponse.mockReset();
    const globalAny: any = global;
    jest.spyOn(globalAny, "fetch").mockImplementation(async () => ({
      json: mockJsonResponse,
      default: mockFetch
    }));
  });

  it("should return the correct qr code", async () => {
    expect.assertions(1);
    const document: any = "SAMPLE_DOCUMENT";
    mockJsonResponse.mockResolvedValue({
      id: "DOCUMENT-ID",
      key: "SECRET-KEY"
    });
    const qrCode = await uploadDocument(document);
    expect(qrCode).toStrictEqual(
      "https://openattestation.com/action?document=%7B%22uri%22:%22https://api-ropsten.opencerts.io/storage/DOCUMENT-ID%22,%22key%22:%22SECRET-KEY%22%7D"
    );
  });

  it("should throw if the request fail", async () => {
    expect.assertions(1);
    const document: any = "SAMPLE_DOCUMENT";
    mockJsonResponse.mockRejectedValue(new Error("TEST_ERROR"));
    await expect(uploadDocument(document)).rejects.toThrow("TEST_ERROR");
  });
});
