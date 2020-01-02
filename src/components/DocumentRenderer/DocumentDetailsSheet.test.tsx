import React from "react";
import { render, wait } from "@testing-library/react-native";
import sampleDoc from "../../../fixtures/demo-caas.json";
import { DocumentDetailsSheet } from "./DocumentDetailsSheet";
import { CheckStatus } from "../Validity";
import { DocumentProperties } from "../../types";

import { useDocumentVerifier } from "../../common/hooks/useDocumentVerifier";
jest.mock("../../common/hooks/useDocumentVerifier");
const mockUseVerifier = useDocumentVerifier as jest.Mock;

jest.mock("../../common/hooks/useQrGenerator", () => ({
  useQrGenerator: () => ({
    qrCode: "QR_CODE"
  })
}));

jest.useFakeTimers();

const testDocument: DocumentProperties = {
  id: "1",
  created: 1,
  document: sampleDoc,
  verified: 1,
  isVerified: true
};

describe("DocumentDetailsSheet", () => {
  it("should show the correct issuer name", async () => {
    expect.assertions(1);
    mockUseVerifier.mockReturnValue({});
    const { queryByText } = render(
      <DocumentDetailsSheet
        document={testDocument}
        onVerification={() => null}
      />
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
        document={testDocument}
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
        document={testDocument}
        onVerification={onVerification}
      />
    );
    await wait(() => {
      expect(onVerification).toHaveBeenCalledTimes(0);
    });
  });

  it("should show the share button if document is valid", async () => {
    expect.assertions(1);
    mockUseVerifier.mockReturnValue({
      overallValidity: CheckStatus.VALID
    });
    const { queryByText } = render(
      <DocumentDetailsSheet
        document={testDocument}
        onVerification={() => null}
      />
    );
    await wait(() => {
      expect(queryByText("Share")).not.toBeNull();
    });
  });

  it("should hide the share button if document is invalid", async () => {
    expect.assertions(1);
    mockUseVerifier.mockReturnValue({
      overallValidity: CheckStatus.INVALID
    });
    const { queryByText } = render(
      <DocumentDetailsSheet
        document={testDocument}
        onVerification={() => null}
      />
    );
    await wait(() => {
      expect(queryByText("Share")).toBeNull();
    });
  });

  it("should hide the share button if document is still being checked", async () => {
    expect.assertions(1);
    mockUseVerifier.mockReturnValue({
      overallValidity: CheckStatus.CHECKING
    });
    const { queryByText } = render(
      <DocumentDetailsSheet
        document={testDocument}
        onVerification={() => null}
      />
    );
    await wait(() => {
      expect(queryByText("Share")).toBeNull();
    });
  });

  it("should show the document metadata", async () => {
    expect.assertions(1);
    mockUseVerifier.mockReturnValue({
      overallValidity: CheckStatus.CHECKING
    });
    const { queryByTestId } = render(
      <DocumentDetailsSheet
        document={testDocument}
        onVerification={() => null}
      />
    );
    await wait(() => {
      expect(queryByTestId("document-metadata")).not.toBeNull();
    });
  });

  it("should show the invalid panel if the document is invalid", async () => {
    expect.assertions(2);
    mockUseVerifier.mockReturnValue({
      overallValidity: CheckStatus.INVALID
    });
    const { queryByTestId } = render(
      <DocumentDetailsSheet
        document={testDocument}
        onVerification={() => null}
      />
    );
    await wait(() => {
      expect(queryByTestId("invalid-panel")).not.toBeNull();
      expect(queryByTestId("qr-code")).toBeNull();
    });
  });

  it("should show the qr code if the document is valid", async () => {
    expect.assertions(2);
    mockUseVerifier.mockReturnValue({
      overallValidity: CheckStatus.VALID
    });
    const { queryByTestId } = render(
      <DocumentDetailsSheet
        document={testDocument}
        onVerification={() => null}
      />
    );
    await wait(() => {
      expect(queryByTestId("invalid-panel")).toBeNull();
      expect(queryByTestId("qr-code")).not.toBeNull();
    });
  });

  it("should not show the invalid panel nor the qr code if the document is being checked", async () => {
    expect.assertions(2);
    mockUseVerifier.mockReturnValue({
      overallValidity: CheckStatus.CHECKING
    });
    const { queryByTestId } = render(
      <DocumentDetailsSheet
        document={testDocument}
        onVerification={() => null}
      />
    );
    await wait(() => {
      expect(queryByTestId("invalid-panel")).toBeNull();
      expect(queryByTestId("qr-code")).toBeNull();
    });
  });
});
