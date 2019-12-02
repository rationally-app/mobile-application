import sampleDoc from "../../../fixtures/demo-oc.json";
import { useDocumentVerifier } from "./useDocumentVerifier";
import { SignedDocument } from "@govtechsg/open-attestation";
import { renderHook } from "@testing-library/react-hooks";
import { CheckStatus } from "../../constants/verifier";

import { checkValidity } from "../../services/DocumentVerifier";
jest.mock("../../services/DocumentVerifier");
const mockCheckValidity = checkValidity as jest.Mock;

jest.useFakeTimers();

describe("useDocumentVerifier", () => {
  it("should return the correct check status as the checks resolve at different times", async () => {
    expect.assertions(3);
    mockCheckValidity.mockReturnValue([
      // verifyHashIssuedRevoked
      new Promise(res =>
        setTimeout(
          () =>
            res({
              hash: { checksumMatch: true },
              issued: { issuedOnAll: true },
              revoked: { revokedOnAny: false },
              valid: true
            }),
          500
        )
      ),

      // verifyIdentity
      new Promise(res =>
        setTimeout(() => res({ identifiedOnAll: true }), 1000)
      ),

      // Mimics that overallValidityCheck should be resolved last
      new Promise(res => setTimeout(() => res(true), 1001))
    ]);

    const { result, waitForNextUpdate } = renderHook(() =>
      useDocumentVerifier(sampleDoc as SignedDocument)
    );

    expect(result.current).toStrictEqual({
      tamperedCheck: CheckStatus.CHECKING,
      issuedCheck: CheckStatus.CHECKING,
      revokedCheck: CheckStatus.CHECKING,
      issuerCheck: CheckStatus.CHECKING,
      overallValidity: CheckStatus.CHECKING
    });

    jest.advanceTimersByTime(500); // verifyHashIssuedRevoked should have resolved

    await waitForNextUpdate();
    expect(result.current).toStrictEqual({
      tamperedCheck: CheckStatus.VALID,
      issuedCheck: CheckStatus.VALID,
      revokedCheck: CheckStatus.VALID,
      issuerCheck: CheckStatus.CHECKING,
      overallValidity: CheckStatus.CHECKING
    });

    jest.runAllTimers(); // Everything should have resolved

    await waitForNextUpdate();
    expect(result.current).toStrictEqual({
      tamperedCheck: CheckStatus.VALID,
      issuedCheck: CheckStatus.VALID,
      revokedCheck: CheckStatus.VALID,
      issuerCheck: CheckStatus.VALID,
      overallValidity: CheckStatus.VALID
    });
  });
});
