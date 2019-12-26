import React from "react";
import { render, wait } from "@testing-library/react-native";
import sampleDoc from "../../../fixtures/demo-caas.json";
import { DocumentDetailsSheet } from "./DocumentDetailsSheet";
import { CheckStatus } from "../Validity";

import { useDocumentVerifier } from "../../common/hooks/useDocumentVerifier";
jest.mock("../../common/hooks/useDocumentVerifier");
const mockUseVerifier = useDocumentVerifier as jest.Mock;

jest.useFakeTimers();

describe("DocumentDetailsSheet", () => {
  it("should show the correct issuer name", async () => {
    expect.assertions(1);
    mockUseVerifier.mockReturnValue({});
    const { queryByText } = render(
      <DocumentDetailsSheet document={sampleDoc} onVerification={() => null} />
    );
    await wait(() => {
      expect(queryByText("caas.openattestation.com")).not.toBeNull();
    });
  });

  it("should call onVerification once checks complete", async () => {
    expect.assertions(1);
    mockUseVerifier.mockReturnValue({
      overallValidity: CheckStatus.VALID
    });
    const onVerification = jest.fn();
    render(
      <DocumentDetailsSheet
        document={sampleDoc}
        onVerification={onVerification}
      />
    );
    await wait(() => {
      expect(onVerification).toHaveBeenCalledTimes(1);
    });
  });

  it("should not call onVerification if checks are still progress", async () => {
    expect.assertions(1);
    mockUseVerifier.mockReturnValue({
      overallValidity: CheckStatus.CHECKING
    });
    const onVerification = jest.fn();
    render(
      <DocumentDetailsSheet
        document={sampleDoc}
        onVerification={onVerification}
      />
    );
    await wait(() => {
      expect(onVerification).toHaveBeenCalledTimes(0);
    });
  });
});
