import React from "react";
import { mockNavigation } from "../../test/helpers/navigation";
import { QrScannerScreenContainer } from "./QrScannerScreenContainer";
import { render, wait } from "@testing-library/react-native";
import { QrCamera } from "./QrCamera";

import { processQr } from "../../services/QrProcessor";
jest.mock("../../services/QrProcessor");
const mockProcessQr = processQr as jest.Mock;

import * as Permissions from "expo-permissions";
jest.mock("expo-permissions", () => ({
  askAsync: jest.fn()
}));
const mockPermissions = Permissions.askAsync as jest.Mock;
mockPermissions.mockResolvedValue({ status: "granted" });

jest.mock("../../common/navigation");

let cameraProps: QrCamera;
jest.mock("./QrCamera", () => ({
  QrCamera: (props: QrCamera) => {
    cameraProps = { ...props };
    return null;
  }
}));

jest.useFakeTimers();

describe("QrScannerScreenContainer", () => {
  beforeEach(() => {
    mockProcessQr.mockReset();
  });

  it("should disable scanning when camera has encountered a QR code", async () => {
    expect.assertions(2);
    render(<QrScannerScreenContainer navigation={mockNavigation} />);

    await wait(() => {
      expect(cameraProps.disabled).toBe(false);
      cameraProps.onQrData("data1");
      expect(cameraProps.disabled).toBe(true);
    });
  });

  it("should not process additional QR data when scanning is disabled", async () => {
    expect.assertions(3);
    // Mimic slow processing of QR
    mockProcessQr.mockImplementation(
      () =>
        new Promise(res =>
          setTimeout(() => {
            res(true);
          }, 1000)
        )
    );
    render(<QrScannerScreenContainer navigation={mockNavigation} />);

    await wait(() => {
      cameraProps.onQrData("data1");
      expect(cameraProps.disabled).toBe(true);
      expect(mockProcessQr).toHaveBeenCalledTimes(1);

      cameraProps.onQrData("data2");
      expect(mockProcessQr).toHaveBeenCalledTimes(1);
    });
  });

  it("should navigate when QR processing succeeds", async () => {
    expect.assertions(3);
    mockProcessQr.mockImplementation((_, { onDocumentView }) => {
      onDocumentView();
    });

    render(<QrScannerScreenContainer navigation={mockNavigation} />);

    await wait(() => {
      cameraProps.onQrData("data1");
      expect(cameraProps.disabled).toBe(true);
      expect(mockProcessQr).toHaveBeenCalledTimes(1);
      expect(mockNavigation.navigate).toHaveBeenCalledTimes(1);
    });
  });

  it("should re-enable scanning when QR processing fails", async () => {
    expect.assertions(2);
    mockProcessQr.mockImplementation(() => {
      throw new Error();
    });

    render(<QrScannerScreenContainer navigation={mockNavigation} />);

    await wait(() => {
      cameraProps.onQrData("data1");
      expect(mockProcessQr).toHaveBeenCalledTimes(1);
      expect(cameraProps.disabled).toBe(false);
    });
  });
});
