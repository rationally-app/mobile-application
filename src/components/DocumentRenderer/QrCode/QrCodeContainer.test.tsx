import React, { createRef } from "react";
import { render } from "@testing-library/react-native";
import { QrCodeContainer, QrCodeContainerRef } from "./QrCodeContainer";
import { NetworkContext } from "../../../context/network";
import sampleDoc from "../../../../fixtures/demo-caas.json";

import { useQrGenerator } from "../../../common/hooks/useQrGenerator";
jest.mock("../../../common/hooks/useQrGenerator");
const mockUseQrGenerator = useQrGenerator as jest.Mock;

const mockQrCode = `https://openattestation.com/action?document=%7B%22uri%22:%22https://api-ropsten.opencerts.io/storage/DOCUMENT-ID%22,%22key%22:%22SECRET-KEY%22%7D`;

import { useCountdown } from "../../../common/hooks/useCountdown";
import { act } from "react-test-renderer";
jest.mock("../../../common/hooks/useCountdown");
const mockUseCountdown = useCountdown as jest.Mock;

const mockAtomicUpdate = jest.fn();
const testDocument = {
  id: "1",
  created: 1,
  document: sampleDoc,
  verified: 1,
  isVerified: true,
  atomicUpdate: mockAtomicUpdate
};

describe("QrCodeContainer", () => {
  beforeEach(() => {
    mockAtomicUpdate.mockReset();
  });

  it("should show the expiry as 30 seconds if seconds left is 30", () => {
    expect.assertions(1);
    mockUseQrGenerator.mockReturnValue({
      qrCode: { url: mockQrCode, expiry: 1 },
      qrCodeLoading: false,
      generateQr: jest.fn()
    });
    mockUseCountdown.mockReturnValue({
      secondsLeft: 30,
      startCountdown: jest.fn()
    });
    const { queryByText } = render(
      <NetworkContext.Provider value={{ isConnected: false }}>
        <QrCodeContainer document={testDocument} refreshPaused={false} />
      </NetworkContext.Provider>
    );

    expect(queryByText("Expires in 30 seconds")).not.toBeNull();
  });

  it("should show the expiry as 1 minute, 30 seconds if seconds left is 90", () => {
    expect.assertions(1);
    mockUseQrGenerator.mockReturnValue({
      qrCode: { url: mockQrCode, expiry: 1 },
      qrCodeLoading: false,
      generateQr: jest.fn()
    });
    mockUseCountdown.mockReturnValue({
      secondsLeft: 90,
      startCountdown: jest.fn()
    });
    const { queryByText } = render(
      <NetworkContext.Provider value={{ isConnected: true }}>
        <QrCodeContainer document={testDocument} refreshPaused={false} />
      </NetworkContext.Provider>
    );

    expect(queryByText("Expires in 1 minute, 30 seconds")).not.toBeNull();
  });

  it("should show the expiry as 1 hour, 1 minute, 30 seconds if seconds left is 3690", () => {
    expect.assertions(1);
    mockUseQrGenerator.mockReturnValue({
      qrCode: { url: mockQrCode, expiry: 1 },
      qrCodeLoading: false,
      generateQr: jest.fn()
    });
    mockUseCountdown.mockReturnValue({
      secondsLeft: 3690,
      startCountdown: jest.fn()
    });
    const { queryByText } = render(
      <NetworkContext.Provider value={{ isConnected: false }}>
        <QrCodeContainer document={testDocument} refreshPaused={false} />
      </NetworkContext.Provider>
    );

    expect(
      queryByText("Expires in 1 hour, 1 minute, 30 seconds")
    ).not.toBeNull();
  });

  it("should show the expiry as expired if seconds left is 0", () => {
    expect.assertions(1);
    mockUseQrGenerator.mockReturnValue({
      qrCode: { url: mockQrCode, expiry: 1 },
      qrCodeLoading: false,
      generateQr: jest.fn()
    });
    mockUseCountdown.mockReturnValue({
      secondsLeft: 0,
      startCountdown: jest.fn()
    });
    const { queryByText } = render(
      <NetworkContext.Provider value={{ isConnected: true }}>
        <QrCodeContainer document={testDocument} refreshPaused={false} />
      </NetworkContext.Provider>
    );

    expect(queryByText("Expired")).not.toBeNull();
  });

  it("should update the DB when the QR code changes", () => {
    expect.assertions(2);
    mockUseQrGenerator.mockReturnValue({
      qrCode: { url: mockQrCode, expiry: 1 },
      qrCodeLoading: false,
      generateQr: jest.fn()
    });
    mockUseCountdown.mockReturnValue({
      secondsLeft: 30,
      startCountdown: jest.fn()
    });
    const { rerender } = render(
      <NetworkContext.Provider value={{ isConnected: false }}>
        <QrCodeContainer document={testDocument} refreshPaused={false} />
      </NetworkContext.Provider>
    );
    expect(mockAtomicUpdate).toHaveBeenCalledTimes(1);

    mockUseQrGenerator.mockReturnValue({
      qrCode: { url: mockQrCode, expiry: 1 },
      qrCodeLoading: false,
      generateQr: jest.fn()
    });
    rerender(
      <NetworkContext.Provider value={{ isConnected: false }}>
        <QrCodeContainer document={testDocument} refreshPaused={false} />
      </NetworkContext.Provider>
    );
    expect(mockAtomicUpdate).toHaveBeenCalledTimes(2);
  });

  describe("when online", () => {
    it("should not show the offline banner", () => {
      expect.assertions(1);
      const { queryByTestId } = render(
        <NetworkContext.Provider value={{ isConnected: true }}>
          <QrCodeContainer document={testDocument} refreshPaused={false} />
        </NetworkContext.Provider>
      );
      expect(queryByTestId("offline-banner")).toBeNull();
    });

    it("should start the countdown when expiry is specified", () => {
      expect.assertions(2);
      const dateMock = jest
        .spyOn(Date, "now")
        .mockImplementation(() => new Date(2020, 0, 1).getTime());
      mockUseQrGenerator.mockReturnValue({
        qrCode: { url: mockQrCode, expiry: Date.now() + 30000 },
        qrCodeLoading: false,
        generateQr: jest.fn()
      });
      const mockStartCountdown = jest.fn();
      mockUseCountdown.mockReturnValue({
        secondsLeft: 30,
        startCountdown: mockStartCountdown
      });
      render(
        <NetworkContext.Provider value={{ isConnected: true }}>
          <QrCodeContainer document={testDocument} refreshPaused={false} />
        </NetworkContext.Provider>
      );
      expect(mockStartCountdown).toHaveBeenCalledTimes(1);
      expect(mockStartCountdown.mock.calls[0][0]).toBe(30);
      dateMock.mockRestore();
    });

    it("should auto generate a QR when QR code has expired, not generating another QR code and refresh is not paused", () => {
      expect.assertions(1);
      const mockGenerateQr = jest.fn();
      mockUseQrGenerator.mockReturnValue({
        qrCode: { url: mockQrCode, expiry: 1 },
        qrCodeLoading: false,
        generateQr: mockGenerateQr
      });
      mockUseCountdown.mockReturnValue({
        secondsLeft: 0,
        startCountdown: jest.fn()
      });
      render(
        <NetworkContext.Provider value={{ isConnected: true }}>
          <QrCodeContainer document={testDocument} refreshPaused={false} />
        </NetworkContext.Provider>
      );
      expect(mockGenerateQr).toHaveBeenCalledTimes(1);
    });

    it("should not auto generate a QR when QR code has expired, not generating another QR code but refresh is paused", () => {
      expect.assertions(1);
      const mockGenerateQr = jest.fn();
      mockUseQrGenerator.mockReturnValue({
        qrCode: { url: mockQrCode, expiry: 1 },
        qrCodeLoading: false,
        generateQr: mockGenerateQr
      });
      mockUseCountdown.mockReturnValue({
        secondsLeft: 0,
        startCountdown: jest.fn()
      });
      render(
        <NetworkContext.Provider value={{ isConnected: true }}>
          <QrCodeContainer document={testDocument} refreshPaused={true} />
        </NetworkContext.Provider>
      );
      expect(mockGenerateQr).toHaveBeenCalledTimes(0);
    });

    it("should not auto generate a QR when QR code has expired and refresh is not paused, but is generating another QR code", () => {
      expect.assertions(1);
      const mockGenerateQr = jest.fn();
      mockUseQrGenerator.mockReturnValue({
        qrCode: { url: mockQrCode, expiry: 1 },
        qrCodeLoading: true,
        generateQr: mockGenerateQr
      });
      mockUseCountdown.mockReturnValue({
        secondsLeft: 0,
        startCountdown: jest.fn()
      });
      render(
        <NetworkContext.Provider value={{ isConnected: true }}>
          <QrCodeContainer document={testDocument} refreshPaused={false} />
        </NetworkContext.Provider>
      );
      expect(mockGenerateQr).toHaveBeenCalledTimes(0);
    });

    it("should not auto generate a QR when QR code has not expired", () => {
      expect.assertions(1);
      const mockGenerateQr = jest.fn();
      mockUseQrGenerator.mockReturnValue({
        qrCode: { url: mockQrCode, expiry: 1 },
        qrCodeLoading: false,
        generateQr: mockGenerateQr
      });
      mockUseCountdown.mockReturnValue({
        secondsLeft: 10,
        startCountdown: jest.fn()
      });
      render(
        <NetworkContext.Provider value={{ isConnected: true }}>
          <QrCodeContainer document={testDocument} refreshPaused={false} />
        </NetworkContext.Provider>
      );
      expect(mockGenerateQr).toHaveBeenCalledTimes(0);
    });

    it("should generate QR when triggered to generate, even when QR has not expired", () => {
      expect.assertions(1);
      const qrCodeContainerRef = createRef<QrCodeContainerRef>();
      const mockGenerateQr = jest.fn();
      mockUseQrGenerator.mockReturnValue({
        qrCode: { url: mockQrCode, expiry: 1 },
        qrCodeLoading: false,
        generateQr: mockGenerateQr
      });
      mockUseCountdown.mockReturnValue({
        secondsLeft: 10,
        startCountdown: jest.fn()
      });
      render(
        <NetworkContext.Provider value={{ isConnected: true }}>
          <QrCodeContainer
            document={testDocument}
            refreshPaused={false}
            ref={qrCodeContainerRef}
          />
        </NetworkContext.Provider>
      );
      act(() => {
        qrCodeContainerRef.current?.triggerGenerateQr();
      });
      expect(mockGenerateQr).toHaveBeenCalledTimes(1);
    });
  });

  describe("when offline", () => {
    it("should show the offline banner", () => {
      expect.assertions(1);
      const { queryByTestId } = render(
        <NetworkContext.Provider value={{ isConnected: false }}>
          <QrCodeContainer document={testDocument} refreshPaused={false} />
        </NetworkContext.Provider>
      );
      expect(queryByTestId("offline-banner")).not.toBeNull();
    });

    it("should start the countdown when expiry is specified", () => {
      expect.assertions(2);
      const dateMock = jest
        .spyOn(Date, "now")
        .mockImplementation(() => new Date(2020, 0, 1).getTime());
      mockUseQrGenerator.mockReturnValue({
        qrCode: { url: mockQrCode, expiry: Date.now() + 40000 },
        qrCodeLoading: false,
        generateQr: jest.fn()
      });
      const mockStartCountdown = jest.fn();
      mockUseCountdown.mockReturnValue({
        secondsLeft: 40,
        startCountdown: mockStartCountdown
      });
      render(
        <NetworkContext.Provider value={{ isConnected: false }}>
          <QrCodeContainer document={testDocument} refreshPaused={false} />
        </NetworkContext.Provider>
      );
      expect(mockStartCountdown).toHaveBeenCalledTimes(1);
      expect(mockStartCountdown.mock.calls[0][0]).toBe(40);
      dateMock.mockRestore();
    });

    it("should not auto generate a QR when the QR code has expired", () => {
      expect.assertions(2);
      const mockGenerateQr = jest.fn();
      mockUseQrGenerator.mockReturnValue({
        qrCode: { url: mockQrCode, expiry: 1 },
        qrCodeLoading: false,
        generateQr: mockGenerateQr
      });
      mockUseCountdown.mockReturnValue({
        secondsLeft: 0,
        startCountdown: jest.fn()
      });
      const { queryByText } = render(
        <NetworkContext.Provider value={{ isConnected: false }}>
          <QrCodeContainer document={testDocument} refreshPaused={false} />
        </NetworkContext.Provider>
      );
      expect(mockGenerateQr).toHaveBeenCalledTimes(0);
      expect(queryByText("Expired")).not.toBeNull();
    });

    it("should not generate QR when triggered to generate", () => {
      expect.assertions(1);
      const qrCodeContainerRef = createRef<QrCodeContainerRef>();
      const mockGenerateQr = jest.fn();
      mockUseQrGenerator.mockReturnValue({
        qrCode: { url: mockQrCode, expiry: 1 },
        qrCodeLoading: false,
        generateQr: mockGenerateQr
      });
      mockUseCountdown.mockReturnValue({
        secondsLeft: 10,
        startCountdown: jest.fn()
      });
      render(
        <NetworkContext.Provider value={{ isConnected: false }}>
          <QrCodeContainer
            document={testDocument}
            refreshPaused={false}
            ref={qrCodeContainerRef}
          />
        </NetworkContext.Provider>
      );
      act(() => {
        qrCodeContainerRef.current?.triggerGenerateQr();
      });
      expect(mockGenerateQr).toHaveBeenCalledTimes(0);
    });
  });
});
