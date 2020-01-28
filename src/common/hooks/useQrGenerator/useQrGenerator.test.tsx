import { renderHook, act } from "@testing-library/react-hooks";
import sampleDoc from "../../../../fixtures/demo-oc.json";
import { useQrGenerator } from "./index";
import { uploadDocument } from "../../../services/DocumentSharing";

jest.mock("../../../services/DocumentSharing");
jest.mock("lodash/debounce", () => (fn: any) => fn);
jest.mock("../useConfig", () => ({
  useConfig: () => ({ config: { network: "mainnet" } })
}));

const mockUploadDocument = uploadDocument as jest.Mock;

describe("useQrGenerator", () => {
  it("should have empty qr code that is not loading by default", () => {
    expect.assertions(3);
    const { result } = renderHook(() => useQrGenerator());

    expect(result.current.qrCode.url).toBe("");
    expect(result.current.qrCode.expiry).toBeUndefined();
    expect(result.current.qrCodeLoading).toBe(false);
  });

  it("should return the same qr code as the initial qr code by default", () => {
    expect.assertions(3);
    const { result } = renderHook(() =>
      useQrGenerator({ url: "QR_CODE", expiry: 2 })
    );
    expect(result.current.qrCode.url).toBe("QR_CODE");
    expect(result.current.qrCode.expiry).toBe(2);
    expect(result.current.qrCodeLoading).toBe(false);
  });

  it("should upload document and updates qr code", async () => {
    expect.assertions(4);
    const { result } = renderHook(() => useQrGenerator());
    const { generateQr } = result.current;
    mockUploadDocument.mockResolvedValue({ url: "QR_CODE", expiry: 3 });
    let deferredGenerateQr: Promise<void>;
    act(() => {
      deferredGenerateQr = generateQr(sampleDoc);
    });
    expect(result.current.qrCodeLoading).toBe(true);
    await act(async () => {
      await deferredGenerateQr;
    });
    expect(result.current.qrCode.url).toBe("QR_CODE");
    expect(result.current.qrCode.expiry).toBe(3);
    expect(result.current.qrCodeLoading).toBe(false);
  });

  it("should upload document using the correct network", async () => {
    expect.assertions(1);
    const { result } = renderHook(() => useQrGenerator());
    const { generateQr } = result.current;
    mockUploadDocument.mockResolvedValue("QR_CODE");
    await act(async () => {
      await generateQr(sampleDoc);
    });

    expect(mockUploadDocument.mock.calls[0][1]).toBe("mainnet");
  });

  it("should alert errors", async () => {
    expect.assertions(1);
    const { result } = renderHook(() => useQrGenerator());
    const { generateQr } = result.current;
    mockUploadDocument.mockRejectedValue(new Error("UPLOAD_ERROR"));
    await act(async () => {
      await generateQr(sampleDoc);
    });
    const globalAny: any = global;
    expect(globalAny.alert.mock.calls[0][0]).toMatch("UPLOAD_ERROR");
  });
});
