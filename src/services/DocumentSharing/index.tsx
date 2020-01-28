import { Document } from "@govtechsg/open-attestation";
import { STORAGE_API_ENDPOINT } from "../../config";

export interface StorageApiResponse {
  id: string;
  key: string;
  ttl?: number;
}

const DEFAULT_TTL_MS = 10 * 60 * 1000;

/**
 * Returns an object containing the URL of the document and the expiry date
 * @param document
 * @param ttl TTL in milliseconds
 */
export const uploadDocument = async (
  document: Document,
  ttl = DEFAULT_TTL_MS
): Promise<{ url: string; expiry?: number }> => {
  const response: StorageApiResponse = await fetch(STORAGE_API_ENDPOINT, {
    method: "POST",
    body: JSON.stringify({
      document,
      ttl
    })
  }).then(res => res.json());
  const payload = encodeURI(
    JSON.stringify({
      uri: `${STORAGE_API_ENDPOINT}${response.id}`,
      key: response.key
    })
  );
  return {
    url: `https://openattestation.com/action?document=${payload}`,
    expiry: response.ttl || undefined
  };
};
