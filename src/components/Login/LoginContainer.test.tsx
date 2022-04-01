import {
  fireEvent,
  render,
  cleanup,
  waitFor,
  act,
} from "@testing-library/react-native";
import React from "react";
import * as Linking from "expo-linking";
import { InitialisationContainer } from "./LoginContainer";
import { Sentry } from "../../utils/errorTracking";
import { mockNavigation } from "../../test/helpers/navigation";
import { CreateProvidersWrapper } from "../../test/helpers/providers";
import { AlertModalContextProvider } from "../../context/alert";
import * as auth from "../../services/auth";
import "../../common/i18n/i18nMock";

const key = "1e4457bc-f7d0-4329-a344-f0e3c75d8dd4";
const endpoint = "https://somewhere.com";
const invalidAuthMsg =
  "Scan QR code again or get a new QR code from your in-charge.";
const invalidOtpMsg = "Enter OTP again.";
const invalidCountryCode = "Enter a valid country code.";
const phoneNumber = "88888888";
const countryCode = "+65";
const sessionToken = "my-session-token";
const otp = "000000";
const expiry = new Date(2030, 0, 1);

const barcodeScannerId = "barcode-scanner-camera";
const buttonWithLoading = "dark-button-display-loading";
const loginScanViewId = "login-scan-view";
const loadingViewId = "loading-view";
const loginMobileViewId = "login-mobile-number-view";
const loginOTPViewId = "login-otp-card-view";
const loginSendOTPButtonId = "login-send-otp-button";
const loginSubmitOTPButtonId = "login-submit-otp-button";
const scanButtonId = "base-button";
const phoneInputId = "login-phone-number-input";
const OTPInputId = "login-otp-input";
const countryCodeInputId = "login-country-code-input";

jest.mock("../../utils/errorTracking");
const mockCaptureException = jest.fn();
(Sentry.captureException as jest.Mock).mockImplementation(mockCaptureException);

const mockDeepLink = jest.fn();
jest.spyOn(Linking, "parseInitialURLAsync").mockImplementation(mockDeepLink);

const mockRequestOTP = jest.spyOn(auth, "requestOTP");
const mockValidateOTP = jest.spyOn(auth, "validateOTP");

describe("LoginContainer", () => {
  afterEach(() => {
    mockCaptureException.mockReset();
    mockDeepLink.mockReset();
    mockRequestOTP.mockReset();
    mockValidateOTP.mockReset();
    cleanup();
  });

  it("should render LoginScanCard", () => {
    expect.assertions(1);
    const { getByTestId } = render(
      <InitialisationContainer navigation={mockNavigation} />
    );

    const scanButton = getByTestId(scanButtonId);
    fireEvent.press(scanButton);
    expect(getByTestId(loginScanViewId)).not.toBeNull();
  });

  it("should render LoginMobileNumberCard if login endpoint + key in deep link", async () => {
    expect.assertions(2);
    mockDeepLink.mockImplementation(() =>
      Promise.resolve({
        queryParams: { key, endpoint },
      })
    );

    const { getByTestId } = render(
      <InitialisationContainer navigation={mockNavigation} />
    );

    const scanButton = getByTestId(scanButtonId);
    fireEvent.press(scanButton);
    expect(getByTestId(loginScanViewId)).not.toBeNull();
    await waitFor(() => {
      expect(getByTestId(loginMobileViewId)).not.toBeNull();
    });
  });

  it("should render Id scanner", () => {
    expect.assertions(3);
    const { getByTestId, queryByTestId } = render(
      <InitialisationContainer navigation={mockNavigation} />
    );

    const scanButton = getByTestId(scanButtonId);
    fireEvent.press(scanButton);
    expect(getByTestId(loginScanViewId)).not.toBeNull();
    expect(getByTestId(barcodeScannerId)).not.toBeNull();
    expect(queryByTestId(loadingViewId)).toBeNull();
  });

  it("valid QR detected and should render LoginMobileNumberCard", () => {
    expect.assertions(4);
    const { getByTestId, queryByTestId } = render(
      <InitialisationContainer navigation={mockNavigation} />
    );

    const scanButton = getByTestId(scanButtonId);
    fireEvent.press(scanButton);
    expect(getByTestId(loginScanViewId)).not.toBeNull();
    expect(getByTestId(barcodeScannerId)).not.toBeNull();
    expect(queryByTestId(loadingViewId)).toBeNull();

    fireEvent(getByTestId(barcodeScannerId), "onBarCodeScanned", {
      nativeEvent: { data: `{"key": "${key}","endpoint": "${endpoint}"}` },
    });
    expect(getByTestId(loginMobileViewId)).not.toBeNull();
  });

  it("OTP requested successfully and should render LoginOTPCard", async () => {
    expect.assertions(8);
    mockRequestOTP.mockResolvedValueOnce({ status: "OK" });

    const { getByTestId, queryByTestId, queryByText } = render(
      <InitialisationContainer navigation={mockNavigation} />
    );
    const scanButton = getByTestId(scanButtonId);
    fireEvent.press(scanButton);
    expect(getByTestId(loginScanViewId)).not.toBeNull();
    expect(getByTestId(barcodeScannerId)).not.toBeNull();
    expect(queryByTestId(loadingViewId)).toBeNull();

    fireEvent(getByTestId(barcodeScannerId), "onBarCodeScanned", {
      nativeEvent: { data: `{"key": "${key}","endpoint": "${endpoint}"}` },
    });
    expect(getByTestId(loginMobileViewId)).not.toBeNull();

    const phoneNumberInput = getByTestId(phoneInputId);
    const loginSendOTPButton = getByTestId(loginSendOTPButtonId);
    const countryCodeInput = getByTestId(countryCodeInputId);
    fireEvent(phoneNumberInput, "onChangeText", phoneNumber);
    fireEvent(countryCodeInput, "onChangeCountryCode", countryCode);
    fireEvent.press(loginSendOTPButton);
    expect(countryCodeInput.props["value"]).toEqual(countryCode);
    expect(queryByText("Send OTP")).toBeNull();
    expect(getByTestId(buttonWithLoading)).not.toBeNull();
    await waitFor(() => expect(getByTestId(loginOTPViewId)).not.toBeNull());
  });

  it("OTP submitted successfully and navigate to CampaignInitialisationScreen", async () => {
    expect.assertions(8);
    mockRequestOTP.mockResolvedValueOnce({ status: "OK" });
    mockValidateOTP.mockResolvedValueOnce({
      sessionToken: sessionToken,
      ttl: expiry,
    });

    const { getByTestId, queryByTestId, queryByText } = render(
      <InitialisationContainer navigation={mockNavigation} />
    );
    const scanButton = getByTestId(scanButtonId);
    fireEvent.press(scanButton);
    expect(getByTestId(loginScanViewId)).not.toBeNull();
    expect(getByTestId(barcodeScannerId)).not.toBeNull();
    expect(queryByTestId(loadingViewId)).toBeNull();

    fireEvent(getByTestId(barcodeScannerId), "onBarCodeScanned", {
      nativeEvent: { data: `{"key": "${key}","endpoint": "${endpoint}"}` },
    });
    expect(getByTestId(loginMobileViewId)).not.toBeNull();

    const phoneNumberInput = getByTestId(phoneInputId);
    const loginSendOTPButton = getByTestId(loginSendOTPButtonId);
    const countryCodeInput = getByTestId(countryCodeInputId);
    fireEvent(phoneNumberInput, "onChangeText", phoneNumber);
    fireEvent(countryCodeInput, "onChangeCountryCode", countryCode);
    fireEvent.press(loginSendOTPButton);
    expect(getByTestId(buttonWithLoading)).not.toBeNull();
    await waitFor(() => expect(getByTestId(loginOTPViewId)).not.toBeNull());

    const OTPInput = getByTestId(OTPInputId);
    fireEvent(OTPInput, "onChange", {
      nativeEvent: { text: otp },
    });
    await act(async () => fireEvent.press(getByTestId(loginSubmitOTPButtonId)));
    expect(mockValidateOTP).toHaveBeenCalledWith(
      otp,
      `${countryCode}${phoneNumber}`,
      key,
      endpoint
    );
    expect(mockNavigation.navigate).toHaveBeenCalledWith(
      "CampaignInitialisationScreen",
      {
        authCredentials: {
          operatorToken: key,
          sessionToken,
          expiry: expiry.getTime(),
          endpoint,
        },
      }
    );
  });

  describe("should show error modal", () => {
    it("invalid QR detected", () => {
      expect.assertions(5);

      const { getByTestId, queryByTestId, queryByText } = render(
        <CreateProvidersWrapper
          providers={[{ provider: AlertModalContextProvider }]}
        >
          <InitialisationContainer navigation={mockNavigation} />
        </CreateProvidersWrapper>
      );

      const scanButton = getByTestId(scanButtonId);
      fireEvent.press(scanButton);
      expect(getByTestId(loginScanViewId)).not.toBeNull();
      expect(getByTestId(barcodeScannerId)).not.toBeNull();
      expect(queryByTestId(loadingViewId)).toBeNull();

      fireEvent(getByTestId(barcodeScannerId), "onBarCodeScanned", {
        nativeEvent: { data: `{"keys": "${key}","endpoint": "${endpoint}"}` },
      });
      expect(queryByText(invalidAuthMsg)).not.toBeNull();
      expect(mockCaptureException).toHaveBeenCalledTimes(1);
    });

    it("invalid country code input", () => {
      expect.assertions(6);
      const { getByTestId, queryByTestId, queryByText } = render(
        <CreateProvidersWrapper
          providers={[{ provider: AlertModalContextProvider }]}
        >
          <InitialisationContainer navigation={mockNavigation} />
        </CreateProvidersWrapper>
      );

      const scanButton = getByTestId(scanButtonId);
      fireEvent.press(scanButton);
      expect(getByTestId(loginScanViewId)).not.toBeNull();
      expect(getByTestId(barcodeScannerId)).not.toBeNull();
      expect(queryByTestId(loadingViewId)).toBeNull();

      fireEvent(getByTestId(barcodeScannerId), "onBarCodeScanned", {
        nativeEvent: { data: `{"key": "${key}","endpoint": "${endpoint}"}` },
      });
      expect(getByTestId(loginMobileViewId)).not.toBeNull();

      const phoneNumberInput = getByTestId(phoneInputId);
      const loginSendOTPButton = getByTestId(loginSendOTPButtonId);
      const countryCodeInput = getByTestId(countryCodeInputId);
      fireEvent(phoneNumberInput, "onChangeText", phoneNumber);
      fireEvent(countryCodeInput, "onChangeCountryCode", "+900");
      fireEvent.press(loginSendOTPButton);
      expect(countryCodeInput.props["value"]).toEqual("+900");
      expect(queryByText(invalidCountryCode)).not.toBeNull();
    });

    it("invalid otp", async () => {
      expect.assertions(8);
      mockRequestOTP.mockResolvedValueOnce({ status: "OK" });
      mockValidateOTP.mockRejectedValueOnce(
        new auth.OTPWrongError(invalidOtpMsg, false)
      );

      const { getByTestId, queryByTestId, queryByText } = render(
        <CreateProvidersWrapper
          providers={[{ provider: AlertModalContextProvider }]}
        >
          <InitialisationContainer navigation={mockNavigation} />
        </CreateProvidersWrapper>
      );
      const scanButton = getByTestId(scanButtonId);
      fireEvent.press(scanButton);
      expect(getByTestId(loginScanViewId)).not.toBeNull();
      expect(getByTestId(barcodeScannerId)).not.toBeNull();
      expect(queryByTestId(loadingViewId)).toBeNull();

      fireEvent(getByTestId(barcodeScannerId), "onBarCodeScanned", {
        nativeEvent: { data: `{"key": "${key}","endpoint": "${endpoint}"}` },
      });
      expect(getByTestId(loginMobileViewId)).not.toBeNull();

      const phoneNumberInput = getByTestId(phoneInputId);
      const loginSendOTPButton = getByTestId(loginSendOTPButtonId);
      fireEvent(phoneNumberInput, "onChangeText", phoneNumber);
      fireEvent.press(loginSendOTPButton);
      expect(getByTestId(buttonWithLoading)).not.toBeNull();
      await waitFor(() => expect(getByTestId(loginOTPViewId)).not.toBeNull());

      const OTPInput = getByTestId(OTPInputId);
      fireEvent(OTPInput, "onChange", {
        nativeEvent: { text: otp },
      });
      await act(async () =>
        fireEvent.press(getByTestId(loginSubmitOTPButtonId))
      );
      expect(queryByText(invalidOtpMsg)).not.toBeNull();
      expect(mockCaptureException).toHaveBeenCalledTimes(1);
    });
  });
});
