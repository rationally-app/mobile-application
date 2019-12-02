import { useEffect, useState } from "react";
import { SignedDocument } from "@govtechsg/open-attestation";
import { CheckStatus } from "../../constants/verifier";
import { checkValidity } from "../../services/DocumentVerifier";

export interface VerificationStatuses {
  tamperedCheck: CheckStatus;
  issuedCheck: CheckStatus;
  revokedCheck: CheckStatus;
  issuerCheck: CheckStatus;
  overallValidity: CheckStatus;
}

export const useDocumentVerifier = (
  document: SignedDocument
): VerificationStatuses => {
  const [tamperedCheck, setTamperedCheck] = useState(CheckStatus.CHECKING);
  const [issuedCheck, setIssuedCheck] = useState(CheckStatus.CHECKING);
  const [revokedCheck, setRevokedCheck] = useState(CheckStatus.CHECKING);
  const [issuerCheck, setIssuerCheck] = useState(CheckStatus.CHECKING);
  const [overallValidity, setOverallValidity] = useState(CheckStatus.CHECKING);

  useEffect(() => {
    const [
      verifyHashIssuedRevoked,
      verifyIdentity,
      overallValidityCheck
    ] = checkValidity(document);

    verifyHashIssuedRevoked.then(v => {
      setTamperedCheck(
        v.hash.checksumMatch ? CheckStatus.VALID : CheckStatus.INVALID
      );
      setIssuedCheck(
        v.issued.issuedOnAll ? CheckStatus.VALID : CheckStatus.INVALID
      );
      setRevokedCheck(
        v.revoked.revokedOnAny ? CheckStatus.INVALID : CheckStatus.VALID
      );
    });

    verifyIdentity.then(v => {
      setIssuerCheck(
        v.identifiedOnAll ? CheckStatus.VALID : CheckStatus.INVALID
      );
    });

    overallValidityCheck.then(v => {
      setOverallValidity(v ? CheckStatus.VALID : CheckStatus.INVALID);
    });
  }, [document]);

  return {
    tamperedCheck,
    issuedCheck,
    revokedCheck,
    issuerCheck,
    overallValidity
  };
};
