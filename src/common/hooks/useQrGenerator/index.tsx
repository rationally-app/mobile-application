import { useState, useRef, useEffect } from "react";
import { uploadDocument } from "../../../services/DocumentSharing";
import { Document } from "@govtechsg/open-attestation";

export interface QrGenerator {
  qrCode: string;
  qrCodeLoading: boolean;
  generateQr: (document: Document) => () => Promise<void>;
}

export const useQrGenerator = (): QrGenerator => {
  const isMounted = useRef(false);
  const [qrCode, setQrCode] = useState("");
  const [qrCodeLoading, setQrCodeLoading] = useState(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const generateQr = (document: Document) => async (): Promise<void> => {
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
  };

  return { qrCode, qrCodeLoading, generateQr };
};
