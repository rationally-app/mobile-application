import { useState, useRef, useEffect, useCallback } from "react";
import { uploadDocument } from "../../../services/DocumentSharing";
import { Document } from "@govtechsg/open-attestation";
import debounce from "lodash/debounce";

const GENERATE_QR_DEBOUNCE_MS = 500;

type QrCode = { url: string; expiry?: number };
export interface QrGenerator {
  qrCode: QrCode;
  qrCodeLoading: boolean;
  generateQr: (document: Document) => Promise<void>;
}

export const useQrGenerator = (
  initialQrCode: QrCode = { url: "" }
): QrGenerator => {
  const isMounted = useRef(false);
  const [qrCode, setQrCode] = useState<QrCode>(initialQrCode);
  const [qrCodeLoading, setQrCodeLoading] = useState(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const generateQr = useCallback(
    debounce(async (document: Document) => {
      try {
        setQrCodeLoading(true);
        const code = await uploadDocument(document);
        if (!isMounted.current) {
          return;
        }
        setQrCode(code);
      } catch (e) {
        alert(e.message);
      }
      setQrCodeLoading(false);
    }, GENERATE_QR_DEBOUNCE_MS),
    []
  );

  return { qrCode, qrCodeLoading, generateQr };
};
