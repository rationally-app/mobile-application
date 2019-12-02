import { getDocumentStoreRecords } from "@govtechsg/dnsprove";
import { getData, SignedDocument } from "@govtechsg/open-attestation";
import { get } from "lodash";

// Taken from https://github.com/TradeTrust/tradetrust-website/blob/master/src/services/verify/index.js

const getSmartContractAddress = (issuer: any): string =>
  issuer.certificateStore || issuer.documentStore || issuer.tokenRegistry;

const resolveIssuerIdentity = async (
  issuer: any,
  networkName: string
): Promise<any> => {
  const networkId = networkName === "homestead" ? "1" : "3";

  try {
    const smartContractAddress = getSmartContractAddress(issuer);
    const type = get(issuer, "identityProof.type");
    const location = get(issuer, "identityProof.location");
    if (type !== "DNS-TXT") throw new Error("Identity type not supported");
    if (!location) throw new Error("Location is missing");
    const records = await getDocumentStoreRecords(location);
    const matchingRecord = records.find(
      record =>
        record.addr.toLowerCase() === smartContractAddress.toLowerCase() &&
        record.netId === networkId &&
        record.type === "openatts" &&
        record.net === "ethereum"
    );
    return matchingRecord
      ? {
          identified: true,
          dns: get(issuer, "identityProof.location"),
          smartContract: smartContractAddress
        }
      : {
          identified: false,
          smartContract: smartContractAddress
        };
  } catch (e) {
    return {
      identified: false,
      smartContract: getSmartContractAddress(issuer),
      error: e.message || e
    };
  }
};

const getIssuersIdentities = async (
  issuers: any,
  networkName: string
): Promise<any> =>
  Promise.all(
    issuers.map((issuer: any) => resolveIssuerIdentity(issuer, networkName))
  );

const issuersIdentitiesAllVerified = (identities: any[] = []): boolean =>
  identities.every(identity => identity.identified);

export const checkValidIdentity = async (
  document: SignedDocument,
  networkName: string
): Promise<{ identifiedOnAll: boolean; details: [] }> => {
  const documentData = getData(document);
  const identities = await getIssuersIdentities(
    documentData.issuers,
    networkName
  );
  const allIdentitiesValid = issuersIdentitiesAllVerified(identities);
  return {
    identifiedOnAll: allIdentitiesValid,
    details: identities
  };
};
