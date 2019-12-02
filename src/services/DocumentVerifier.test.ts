import sampleDoc from "../../fixtures/demo-caas.json";
import { SignedDocument } from "@govtechsg/open-attestation";
import { checkValidity } from "./DocumentVerifier";

import verify from "@govtechsg/oa-verify";
jest.mock("@govtechsg/oa-verify");
const mockVerify = verify as jest.Mock;

import { checkValidIdentity } from "./IdentityVerifier";
jest.mock("./IdentityVerifier");
const mockCheckValidIdentity = checkValidIdentity as jest.Mock;

jest.useFakeTimers();

const truthyVerifyResult = {
  hash: { checksumMatch: true },
  issued: { issuedOnAll: true },
  revoked: { revokedOnAny: false },
  valid: true
};

const falsyVerifyResult = {
  hash: { checksumMatch: true },
  issued: { issuedOnAll: true },
  revoked: { revokedOnAny: true },
  valid: false
};

const truthyIdentityResult = {
  identifiedOnAll: true
};

const falsyIdentityResult = {
  identifiedOnAll: false
};

describe("ValidityChecker", () => {
  describe("checkValidity", () => {
    describe("when verify and checkValidIdentity return truthy results", () => {
      it("should return promises that resolve to the truthy result", async () => {
        expect.assertions(3);
        mockVerify.mockResolvedValue(truthyVerifyResult);
        mockCheckValidIdentity.mockResolvedValue(truthyIdentityResult);

        const [
          verifyHashIssuedRevoked,
          verifyIdentity,
          overallValidityCheck
        ] = checkValidity(sampleDoc as SignedDocument);

        expect(await verifyHashIssuedRevoked).toBe(truthyVerifyResult);
        expect(await verifyIdentity).toBe(truthyIdentityResult);
        expect(await overallValidityCheck).toBe(true);
      });
    });

    describe("when verify and checkValidIdentity return falsy results", () => {
      it("should return promises that resolve to the falsy result", async () => {
        expect.assertions(3);
        mockVerify.mockResolvedValue(falsyVerifyResult);
        mockCheckValidIdentity.mockResolvedValue(falsyIdentityResult);

        const [
          verifyHashIssuedRevoked,
          verifyIdentity,
          overallValidityCheck
        ] = checkValidity(sampleDoc as SignedDocument);

        expect(await verifyHashIssuedRevoked).toBe(falsyVerifyResult);
        expect(await verifyIdentity).toBe(falsyIdentityResult);
        expect(await overallValidityCheck).toBe(false);
      });
    });

    describe("when verify returns truthy result and checkValidIdentity returns falsy result", () => {
      it("should return promises that resolve to the falsy result", async () => {
        expect.assertions(3);
        mockVerify.mockResolvedValue(truthyVerifyResult);
        mockCheckValidIdentity.mockResolvedValue(falsyIdentityResult);

        const [
          verifyHashIssuedRevoked,
          verifyIdentity,
          overallValidityCheck
        ] = checkValidity(sampleDoc as SignedDocument);

        expect(await verifyHashIssuedRevoked).toBe(truthyVerifyResult);
        expect(await verifyIdentity).toBe(falsyIdentityResult);
        expect(await overallValidityCheck).toBe(false);
      });

      it("should wait till certain about the result before returning the overall validity", async () => {
        expect.assertions(3);
        mockVerify.mockResolvedValue(truthyVerifyResult);
        mockCheckValidIdentity.mockImplementation(
          () =>
            new Promise(res => setTimeout(() => res(falsyIdentityResult), 1000))
        );

        let hasResolvedOverallValidity = false;
        const [
          verifyHashIssuedRevoked,
          verifyIdentity,
          overallValidityCheck
        ] = checkValidity(sampleDoc as SignedDocument);
        overallValidityCheck.then(() => (hasResolvedOverallValidity = true));

        await verifyHashIssuedRevoked;
        expect(hasResolvedOverallValidity).toBe(false); // Can't be certain about the overall validity yet

        jest.advanceTimersByTime(1000);

        await verifyIdentity; // Can be certain about the overall validity after this resolves
        expect(await overallValidityCheck).toBe(false);
        expect(hasResolvedOverallValidity).toBe(true);
      });

      it("should return overall validity early once the first invalid check is returned", async () => {
        expect.assertions(3);
        mockVerify.mockImplementation(
          () =>
            new Promise(res => setTimeout(() => res(truthyVerifyResult), 1000))
        );
        mockCheckValidIdentity.mockResolvedValue(falsyIdentityResult);

        let hasResolvedVerify = false;
        const [
          verifyHashIssuedRevoked,
          verifyIdentity,
          overallValidityCheck
        ] = checkValidity(sampleDoc as SignedDocument);
        verifyHashIssuedRevoked.then(() => (hasResolvedVerify = true));

        await verifyIdentity; // Since identity result is falsy, document is overall invalid
        expect(await overallValidityCheck).toBe(false); // Return the overall validity early
        expect(hasResolvedVerify).toBe(false); // The result of this is inconsequential to the overal validity

        jest.advanceTimersByTime(1000);

        await verifyHashIssuedRevoked;
        expect(hasResolvedVerify).toBe(true);
      });
    });

    describe("when verify returns falsy result and checkValidIdentity returns truthy result", () => {
      it("should return promises that resolve to the falsy result", async () => {
        expect.assertions(3);
        mockVerify.mockResolvedValue(falsyVerifyResult);
        mockCheckValidIdentity.mockResolvedValue(truthyIdentityResult);

        const [
          verifyHashIssuedRevoked,
          verifyIdentity,
          overallValidityCheck
        ] = checkValidity(sampleDoc as SignedDocument);

        expect(await verifyHashIssuedRevoked).toBe(falsyVerifyResult);
        expect(await verifyIdentity).toBe(truthyIdentityResult);
        expect(await overallValidityCheck).toBe(false);
      });
    });
  });
});
