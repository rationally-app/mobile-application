import { useEffect, useState } from "react";
import { SignedDocument } from "@govtechsg/open-attestation";
import { CheckStatus } from "../../../components/Validity";
import { checkValidity } from "../../../services/DocumentVerifier";

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
    let cancelled = false;
    const [
      verifyHash,
      verifyIssued,
      verifyRevoked,
      verifyIdentity,
      overallValidityCheck
    ] = checkValidity(document);

    verifyHash.then(
      v =>
        !cancelled &&
        setTamperedCheck(
          v.checksumMatch ? CheckStatus.VALID : CheckStatus.INVALID
        )
    );
    verifyIssued.then(
      v =>
        !cancelled &&
        setIssuedCheck(v.issuedOnAll ? CheckStatus.VALID : CheckStatus.INVALID)
    );

    verifyRevoked.then(
      v =>
        !cancelled &&
        setRevokedCheck(
          v.revokedOnAny ? CheckStatus.INVALID : CheckStatus.VALID
        )
    );

    verifyIdentity.then(
      v =>
        !cancelled &&
        setIssuerCheck(
          v.identifiedOnAll ? CheckStatus.VALID : CheckStatus.INVALID
        )
    );

    overallValidityCheck.then(
      v =>
        !cancelled &&
        setOverallValidity(v ? CheckStatus.VALID : CheckStatus.INVALID)
    );

    return () => {
      cancelled = true;
    };
  }, [document]);

  return {
    tamperedCheck,
    issuedCheck,
    revokedCheck,
    issuerCheck,
    overallValidity
  };
};
