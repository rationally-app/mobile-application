import { verifyWithIndividualChecks } from "@govtechsg/oa-verify";
import { SignedDocument } from "@govtechsg/open-attestation";
import { checkValidIdentity } from "./IdentityVerifier";

// Ensures TS infers the type of the array as a tuple instead
// https://github.com/Microsoft/TypeScript/pull/24897
function tuple<T extends any[]>(...data: T): T {
  return data;
}

// Let TS infer the return type
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const checkValidity = (
  document: SignedDocument,
  network = "ropsten" // TODO: handle this based on some user selection of the network
) => {
  const isMainnet = network === "mainnet";
  const networkName = isMainnet ? "homestead" : "ropsten";

  const [verifyHash, verifyIssued, verifyRevoked] = verifyWithIndividualChecks(
    document,
    networkName
  );

  const verifyIdentity = checkValidIdentity(document, networkName);

  // If any of the checks are invalid, resolve the overall validity early
  const overallValidityCheck = Promise.all([
    new Promise(async (resolve, reject) =>
      (await verifyHash).checksumMatch ? resolve() : reject()
    ),
    new Promise(async (resolve, reject) =>
      (await verifyIssued).issuedOnAll ? resolve() : reject()
    ),
    new Promise(async (resolve, reject) =>
      (await verifyRevoked).revokedOnAny ? reject() : resolve()
    ),
    new Promise(async (resolve, reject) =>
      (await verifyIdentity).identifiedOnAll ? resolve() : reject()
    )
  ])
    .then(() => true)
    .catch(() => false);

  return tuple(
    verifyHash,
    verifyIssued,
    verifyRevoked,
    verifyIdentity,
    overallValidityCheck
  );
};
