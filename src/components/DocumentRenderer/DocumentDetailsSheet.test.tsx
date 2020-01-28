import React from "react";
import { render, wait } from "@testing-library/react-native";
import sampleDoc from "../../../fixtures/demo-caas.json";
import { DocumentDetailsSheet } from "./DocumentDetailsSheet";
import { CheckStatus } from "../Validity";
import { NetworkContext } from "../../context/network";

jest.mock("lodash/debounce", () => (fn: any) => fn);

import { useDocumentVerifier } from "../../common/hooks/useDocumentVerifier";
jest.mock("../../common/hooks/useDocumentVerifier");
const mockUseVerifier = useDocumentVerifier as jest.Mock;

jest
  .spyOn(Date, "now")
  .mockImplementation(() => new Date(2020, 0, 1).getTime());

const mockGenerateQr = jest.fn();
jest.mock("../../common/hooks/useQrGenerator", () => ({
  useQrGenerator: () => ({
    qrCode: {
      url:
        "https://openattestation.com/action?document=%7B%22uri%22:%22https://hosted-document.com/doc/foo-bar%22%7D"
    },
    generateQr: mockGenerateQr,
    qrCodeLoading: false
  })
}));

jest.useFakeTimers();

const testDocument = {
  id: "1",
  created: 1,
  document: sampleDoc,
  verified: 1,
  isVerified: true,
  atomicUpdate: jest.fn()
};

const testDocumentWithQrNoExpiry = {
  ...testDocument,
  qrCode: {
    url:
      "https://openattestation.com/action?document=%7B%22uri%22:%22https://hosted-document.com/doc/foo-bar%22%7D"
  }
};

const testDocumentWithQrNotExpired = {
  ...testDocument,
  qrCode: {
    url:
      "https://openattestation.com/action?document=%7B%22uri%22:%22https://hosted-document.com/doc/foo-bar%22%7D",
    expiry: new Date(2020, 1, 1).getTime()
  }
};

const testDocumentWithQrButExpired = {
  ...testDocument,
  qrCode: {
    url:
      "https://openattestation.com/action?document=%7B%22uri%22:%22https://hosted-document.com/doc/foo-bar%22%7D",
    expiry: new Date(2019, 11, 1).getTime()
  }
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

  describe("share button", () => {
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

  describe("priority content", () => {
    describe("when document has no existing qr code", () => {
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

      it("should not show any priority content if document is still checking", async () => {
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
          expect(queryByTestId("priority-content")).toBeNull();
        });
      });
    });

    describe("when document has existing qr code without expiry", () => {
      it("should show the qr code when document is valid", async () => {
        expect.assertions(2);
        mockUseVerifier.mockReturnValue({
          overallValidity: CheckStatus.VALID
        });
        const { queryByTestId } = render(
          <DocumentDetailsSheet
            document={testDocumentWithQrNoExpiry}
            onVerification={() => null}
          />
        );
        await wait(() => {
          expect(queryByTestId("invalid-panel")).toBeNull();
          expect(queryByTestId("qr-code")).not.toBeNull();
        });
      });

      it("should show the qr code when document is invalid", async () => {
        expect.assertions(2);
        mockUseVerifier.mockReturnValue({
          overallValidity: CheckStatus.INVALID
        });
        const { queryByTestId } = render(
          <DocumentDetailsSheet
            document={testDocumentWithQrNoExpiry}
            onVerification={() => null}
          />
        );
        await wait(() => {
          expect(queryByTestId("invalid-panel")).toBeNull();
          expect(queryByTestId("qr-code")).not.toBeNull();
        });
      });

      it("should show the qr code when document status is checking", async () => {
        expect.assertions(2);
        mockUseVerifier.mockReturnValue({
          overallValidity: CheckStatus.CHECKING
        });
        const { queryByTestId } = render(
          <DocumentDetailsSheet
            document={testDocumentWithQrNoExpiry}
            onVerification={() => null}
          />
        );
        await wait(() => {
          expect(queryByTestId("invalid-panel")).toBeNull();
          expect(queryByTestId("qr-code")).not.toBeNull();
        });
      });
    });

    describe("when document has existing qr code that has not expired", () => {
      it("should show the qr code when document is valid", async () => {
        expect.assertions(2);
        mockUseVerifier.mockReturnValue({
          overallValidity: CheckStatus.VALID
        });
        const { queryByTestId } = render(
          <DocumentDetailsSheet
            document={testDocumentWithQrNotExpired}
            onVerification={() => null}
          />
        );
        await wait(() => {
          expect(queryByTestId("invalid-panel")).toBeNull();
          expect(queryByTestId("qr-code")).not.toBeNull();
        });
      });

      it("should show the qr code when document is invalid", async () => {
        expect.assertions(2);
        mockUseVerifier.mockReturnValue({
          overallValidity: CheckStatus.INVALID
        });
        const { queryByTestId } = render(
          <DocumentDetailsSheet
            document={testDocumentWithQrNotExpired}
            onVerification={() => null}
          />
        );
        await wait(() => {
          expect(queryByTestId("invalid-panel")).toBeNull();
          expect(queryByTestId("qr-code")).not.toBeNull();
        });
      });

      it("should show the qr code when document status is checking", async () => {
        expect.assertions(2);
        mockUseVerifier.mockReturnValue({
          overallValidity: CheckStatus.CHECKING
        });
        const { queryByTestId } = render(
          <DocumentDetailsSheet
            document={testDocumentWithQrNotExpired}
            onVerification={() => null}
          />
        );
        await wait(() => {
          expect(queryByTestId("invalid-panel")).toBeNull();
          expect(queryByTestId("qr-code")).not.toBeNull();
        });
      });
    });

    describe("when document has existing qr code but has expired", () => {
      it("should show the qr code when document is valid", async () => {
        expect.assertions(2);
        mockUseVerifier.mockReturnValue({
          overallValidity: CheckStatus.VALID
        });
        const { queryByTestId } = render(
          <DocumentDetailsSheet
            document={testDocumentWithQrButExpired}
            onVerification={() => null}
          />
        );
        await wait(() => {
          expect(queryByTestId("invalid-panel")).toBeNull();
          expect(queryByTestId("qr-code")).not.toBeNull();
        });
      });

      it("should show the qr code when document is invalid", async () => {
        expect.assertions(2);
        mockUseVerifier.mockReturnValue({
          overallValidity: CheckStatus.INVALID
        });
        const { queryByTestId } = render(
          <DocumentDetailsSheet
            document={testDocumentWithQrButExpired}
            onVerification={() => null}
          />
        );
        await wait(() => {
          expect(queryByTestId("invalid-panel")).not.toBeNull();
          expect(queryByTestId("qr-code")).toBeNull();
        });
      });

      it("should show the qr code when document status is checking", async () => {
        expect.assertions(2);
        mockUseVerifier.mockReturnValue({
          overallValidity: CheckStatus.CHECKING
        });
        const { queryByTestId } = render(
          <DocumentDetailsSheet
            document={testDocumentWithQrButExpired}
            onVerification={() => null}
          />
        );
        await wait(() => {
          expect(queryByTestId("invalid-panel")).toBeNull();
          expect(queryByTestId("qr-code")).toBeNull();
        });
      });
    });
  });

  describe("when document is valid and sheet is opened", () => {
    it("should generate a QR", async () => {
      expect.assertions(1);
      mockUseVerifier.mockReturnValue({
        overallValidity: CheckStatus.VALID
      });
      render(
        <NetworkContext.Provider value={{ isConnected: true }}>
          <DocumentDetailsSheet
            document={testDocument}
            onVerification={() => null}
            initialSheetOpen={true}
          />
        </NetworkContext.Provider>
      );
      await wait(() => {
        expect(mockGenerateQr).toHaveBeenCalledTimes(1);
      });
    });
  });
});
