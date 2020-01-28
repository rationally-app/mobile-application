import { Document } from "@govtechsg/open-attestation";
import {
  ROPSTEN_STORAGE_API_ENDPOINT,
  MAINNET_STORAGE_API_ENDPOINT
} from "../../config";
import { NetworkTypes } from "../../types";

export interface StorageApiResponse {
  id: string;
  key: string;
  ttl?: number;
  error?: string;
}

const DEFAULT_TTL_MS = 10 * 60 * 1000;

/**
 * Returns an object containing the URL of the document and the expiry date
 * @param document
 * @param ttl TTL in milliseconds
 */
export const uploadDocument = async (
  document: Document,
  network: NetworkTypes,
  ttl = DEFAULT_TTL_MS
): Promise<{ url: string; expiry?: number }> => {
  const endpoint =
    network === NetworkTypes.mainnet
      ? MAINNET_STORAGE_API_ENDPOINT
      : ROPSTEN_STORAGE_API_ENDPOINT;
  const response: StorageApiResponse = await fetch(endpoint, {
    method: "POST",
    body: JSON.stringify({
      document,
      ttl
    })
  }).then(res => res.json());
  if (response.error) throw new Error(response.error);
  const payload = encodeURI(
    JSON.stringify({
      uri: `${endpoint}${response.id}`,
      key: response.key
    })
  );
  return {
    url: `https://openattestation.com/action?document=${payload}`,
    expiry: response.ttl || undefined
  };
};
