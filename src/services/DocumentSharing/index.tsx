import { Document } from "@govtechsg/open-attestation";
import { STORAGE_API_ENDPOINT } from "../../config";

export interface StorageApiResponse {
  id: string;
  key: string;
}

export const uploadDocument = async (document: Document): Promise<string> => {
  const response: StorageApiResponse = await fetch(STORAGE_API_ENDPOINT, {
    method: "POST",
    body: JSON.stringify({
      document
    })
  }).then(res => res.json());
  const payload = encodeURI(
    JSON.stringify({
      uri: `${STORAGE_API_ENDPOINT}${response.id}`,
      key: response.key
    })
  );
  return `https://openattestation.com/action?document=${payload}`;
};
