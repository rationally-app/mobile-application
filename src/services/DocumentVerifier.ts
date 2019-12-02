import verify from "@govtechsg/oa-verify";
import { SignedDocument } from "@govtechsg/open-attestation";
import { checkValidIdentity } from "./IdentityVerifier";

export const checkValidity = (
  document: SignedDocument,
  network = "ropsten" // TODO: handle this based on some user selection of the network
): [
  ReturnType<typeof verify>,
  ReturnType<typeof checkValidIdentity>,
  Promise<boolean>
] => {
  const isMainnet = network === "mainnet";
  const networkName = isMainnet ? "homestead" : "ropsten";

  const verifyHashIssuedRevoked = verify(document, networkName);
  const verifyIdentity = checkValidIdentity(document, networkName);

  // If any of the checks are invalid, resolve the overall validity early
  const overallValidityCheck = Promise.all([
    new Promise(async (resolve, reject) =>
      (await verifyHashIssuedRevoked).valid ? resolve() : reject()
    ),
    new Promise(async (resolve, reject) =>
      (await verifyIdentity).identifiedOnAll ? resolve() : reject()
    )
  ])
    .then(() => true)
    .catch(() => false);

  return [verifyHashIssuedRevoked, verifyIdentity, overallValidityCheck];
};
