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
import { NetworkError } from "../../services/helpers";

const key = "1e4457bc-f7d0-4329-a344-f0e3c75d8dd4";
const endpoint = "https://somewhere.com";
const phoneNumber = "88888888";
const countryCode = "+65";
const sessionToken = "my-session-token";
const otp = "000000";
const expiry = new Date(2030, 0, 1);

const barcodeScannerId = "barcode-scanner-camera";
const loginScanViewId = "login-scan-view";
const loginMobileViewId = "login-mobile-number-view";
const loginOTPViewId = "login-otp-card-view";
const loginSendOTPButtonId = "login-send-otp-button";
const loginSubmitOTPButtonId = "login-submit-otp-button";
const scanButtonId = "base-button";
const phoneInputId = "login-phone-number-input";
const OTPInputId = "login-otp-input";
const countryCodeInputId = "login-country-code-input";
const alertModelButtonId = "alert-modal-primary-button";

jest.mock("../../utils/errorTracking");
const mockCaptureException = jest.fn();
(Sentry.captureException as jest.Mock).mockImplementation(mockCaptureException);

const mockDeepLink = jest.fn();
jest.spyOn(Linking, "parseInitialURLAsync").mockImplementation(mockDeepLink);

jest.mock("expo-camera", () => {
  return {
    Camera: {
      requestCameraPermissionsAsync: () => {
        return {
          status: "granted",
        };
      },
    },
  };
});

const mockRequestOTP = jest.spyOn(auth, "requestOTP");
const mockValidateOTP = jest.spyOn(auth, "validateOTP");

const mockRoute: any = {
  params: {},
};

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
      <InitialisationContainer navigation={mockNavigation} route={mockRoute} />
    );
    expect(getByTestId(loginScanViewId)).not.toBeNull();
  });

  it("login endpoint + key in deep link and should render LoginMobileNumberCard", async () => {
    expect.assertions(1);
    mockDeepLink.mockImplementation(() =>
      Promise.resolve({
        queryParams: { key, endpoint },
      })
    );

    const { getByTestId } = render(
      <InitialisationContainer navigation={mockNavigation} route={mockRoute} />
    );

    await waitFor(() => {
      expect(getByTestId(loginMobileViewId)).not.toBeNull();
    });
  });

  it("should render Id scanner", async () => {
    expect.assertions(1);
    const { getByTestId } = render(
      <InitialisationContainer navigation={mockNavigation} route={mockRoute} />
    );
    const scanButton = getByTestId(scanButtonId);
    await act(async () => fireEvent.press(scanButton));
    expect(getByTestId(barcodeScannerId)).not.toBeNull();
  });

  it("valid QR detected and should render LoginMobileNumberCard", async () => {
    expect.assertions(1);
    const { getByTestId } = render(
      <InitialisationContainer navigation={mockNavigation} route={mockRoute} />
    );

    const scanButton = getByTestId(scanButtonId);
    await act(async () => fireEvent.press(scanButton));
    fireEvent(getByTestId(barcodeScannerId), "onBarCodeScanned", {
      nativeEvent: { data: `{"key": "${key}","endpoint": "${endpoint}"}` },
    });
    expect(getByTestId(loginMobileViewId)).not.toBeNull();
  });

  it("submit valid hp number and country code, and button should render loading", async () => {
    expect.assertions(1);
    mockRequestOTP.mockResolvedValueOnce({ status: "OK" });

    const { getByTestId, queryByText } = render(
      <InitialisationContainer navigation={mockNavigation} route={mockRoute} />
    );
    const scanButton = getByTestId(scanButtonId);
    await act(async () => fireEvent.press(scanButton));
    fireEvent(getByTestId(barcodeScannerId), "onBarCodeScanned", {
      nativeEvent: { data: `{"key": "${key}","endpoint": "${endpoint}"}` },
    });

    const phoneNumberInput = getByTestId(phoneInputId);
    const loginSendOTPButton = getByTestId(loginSendOTPButtonId);
    const countryCodeInput = getByTestId(countryCodeInputId);
    fireEvent(phoneNumberInput, "onChangeText", phoneNumber);
    fireEvent(countryCodeInput, "onChangeCountryCode", countryCode);
    await act(async () => fireEvent.press(loginSendOTPButton));
    expect(queryByText("Send OTP")).toBeNull();
  });

  it("OTP requested successfully and should render LoginOTPCard", async () => {
    expect.assertions(1);
    mockRequestOTP.mockResolvedValueOnce({ status: "OK" });

    const { getByTestId } = render(
      <InitialisationContainer navigation={mockNavigation} route={mockRoute} />
    );
    const scanButton = getByTestId(scanButtonId);
    await act(async () => fireEvent.press(scanButton));
    fireEvent(getByTestId(barcodeScannerId), "onBarCodeScanned", {
      nativeEvent: { data: `{"key": "${key}","endpoint": "${endpoint}"}` },
    });

    const phoneNumberInput = getByTestId(phoneInputId);
    const loginSendOTPButton = getByTestId(loginSendOTPButtonId);
    const countryCodeInput = getByTestId(countryCodeInputId);
    fireEvent(phoneNumberInput, "onChangeText", phoneNumber);
    fireEvent(countryCodeInput, "onChangeCountryCode", countryCode);
    await act(async () => fireEvent.press(loginSendOTPButton));
    expect(getByTestId(loginOTPViewId)).not.toBeNull();
  });

  it("OTP submitted successfully and navigate to CampaignInitialisationScreen", async () => {
    expect.assertions(2);
    mockRequestOTP.mockResolvedValueOnce({ status: "OK" });
    mockValidateOTP.mockResolvedValueOnce({
      sessionToken: sessionToken,
      ttl: expiry,
    });

    const { getByTestId } = render(
      <InitialisationContainer navigation={mockNavigation} route={mockRoute} />
    );
    const scanButton = getByTestId(scanButtonId);
    await act(async () => fireEvent.press(scanButton));
    fireEvent(getByTestId(barcodeScannerId), "onBarCodeScanned", {
      nativeEvent: { data: `{"key": "${key}","endpoint": "${endpoint}"}` },
    });

    const phoneNumberInput = getByTestId(phoneInputId);
    const loginSendOTPButton = getByTestId(loginSendOTPButtonId);
    const countryCodeInput = getByTestId(countryCodeInputId);
    fireEvent(phoneNumberInput, "onChangeText", phoneNumber);
    fireEvent(countryCodeInput, "onChangeCountryCode", countryCode);
    await act(async () => fireEvent.press(loginSendOTPButton));

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
      "Campaign Initialisation Screen",
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
    it("invalid QR detected", async () => {
      expect.assertions(2);
      const { getByTestId, queryByText } = render(
        <CreateProvidersWrapper
          providers={[{ provider: AlertModalContextProvider }]}
        >
          <InitialisationContainer
            navigation={mockNavigation}
            route={mockRoute}
          />
        </CreateProvidersWrapper>
      );

      const scanButton = getByTestId(scanButtonId);
      await act(async () => fireEvent.press(scanButton));
      fireEvent(getByTestId(barcodeScannerId), "onBarCodeScanned", {
        nativeEvent: { data: `{"keys": "${key}","endpoint": "${endpoint}"}` },
      });
      expect(
        queryByText(
          "Scan QR code again or get a new QR code from your in-charge."
        )
      ).not.toBeNull();
      expect(mockCaptureException).toHaveBeenCalledTimes(1);
    });
    describe("validate RegEx format for Domain from QR detected", () => {
      const mockRegexValidate = jest.spyOn(RegExp.prototype, "test");

      afterEach(() => {
        mockRegexValidate.mockClear();
      });

      it("should not show Error dialog if valid RegEx format", async () => {
        expect.assertions(2);
        const { getByTestId, queryByText } = render(
          <CreateProvidersWrapper
            providers={[{ provider: AlertModalContextProvider }]}
          >
            <InitialisationContainer
              navigation={mockNavigation}
              route={mockRoute}
            />
          </CreateProvidersWrapper>
        );

        mockRegexValidate.mockReturnValueOnce(true);
        const scanButton = getByTestId(scanButtonId);
        await act(async () => fireEvent.press(scanButton));
        fireEvent(getByTestId(barcodeScannerId), "onBarCodeScanned", {
          nativeEvent: { data: `{"key": "${key}","endpoint": "${endpoint}"}` },
        });
        expect(
          queryByText("Get new QR code from your in-charge and try again.")
        ).toBeNull();
        expect(mockCaptureException).toHaveBeenCalledTimes(0);
      });

      it("should show Error dialog if invalid RegEx format", async () => {
        expect.assertions(2);
        const { getByTestId, queryByText } = render(
          <CreateProvidersWrapper
            providers={[{ provider: AlertModalContextProvider }]}
          >
            <InitialisationContainer
              navigation={mockNavigation}
              route={mockRoute}
            />
          </CreateProvidersWrapper>
        );

        mockRegexValidate.mockReturnValueOnce(false);
        const scanButton = getByTestId(scanButtonId);
        await act(async () => fireEvent.press(scanButton));
        fireEvent(getByTestId(barcodeScannerId), "onBarCodeScanned", {
          nativeEvent: { data: `{"key": "${key}","endpoint": "${endpoint}"}` },
        });
        expect(
          queryByText("Get new QR code from your in-charge and try again.")
        ).not.toBeNull();
        expect(mockCaptureException).toHaveBeenCalledTimes(1);
      });
    });

    it("country code input is invalid", async () => {
      expect.assertions(1);
      const { getByTestId, queryByText } = render(
        <CreateProvidersWrapper
          providers={[{ provider: AlertModalContextProvider }]}
        >
          <InitialisationContainer
            navigation={mockNavigation}
            route={mockRoute}
          />
        </CreateProvidersWrapper>
      );

      const scanButton = getByTestId(scanButtonId);
      await act(async () => fireEvent.press(scanButton));
      fireEvent(getByTestId(barcodeScannerId), "onBarCodeScanned", {
        nativeEvent: { data: `{"key": "${key}","endpoint": "${endpoint}"}` },
      });

      const phoneNumberInput = getByTestId(phoneInputId);
      const loginSendOTPButton = getByTestId(loginSendOTPButtonId);
      const countryCodeInput = getByTestId(countryCodeInputId);
      fireEvent(phoneNumberInput, "onChangeText", phoneNumber);
      fireEvent(countryCodeInput, "onChangeCountryCode", "+900");
      fireEvent.press(loginSendOTPButton);
      expect(queryByText("Enter a valid country code.")).not.toBeNull();
    });

    it("hp number input is invalid", async () => {
      expect.assertions(1);
      const { getByTestId, queryByText } = render(
        <CreateProvidersWrapper
          providers={[{ provider: AlertModalContextProvider }]}
        >
          <InitialisationContainer
            navigation={mockNavigation}
            route={mockRoute}
          />
        </CreateProvidersWrapper>
      );

      const scanButton = getByTestId(scanButtonId);
      await act(async () => fireEvent.press(scanButton));
      fireEvent(getByTestId(barcodeScannerId), "onBarCodeScanned", {
        nativeEvent: { data: `{"key": "${key}","endpoint": "${endpoint}"}` },
      });

      const phoneNumberInput = getByTestId(phoneInputId);
      const loginSendOTPButton = getByTestId(loginSendOTPButtonId);
      const countryCodeInput = getByTestId(countryCodeInputId);
      fireEvent(phoneNumberInput, "onChangeText", "888888888");
      fireEvent(countryCodeInput, "onChangeCountryCode", countryCode);
      fireEvent.press(loginSendOTPButton);
      expect(queryByText("Enter a valid contact number.")).not.toBeNull();
    });

    it("hp number input is empty", async () => {
      expect.assertions(1);
      const { getByTestId, queryByText } = render(
        <CreateProvidersWrapper
          providers={[{ provider: AlertModalContextProvider }]}
        >
          <InitialisationContainer
            navigation={mockNavigation}
            route={mockRoute}
          />
        </CreateProvidersWrapper>
      );

      const scanButton = getByTestId(scanButtonId);
      await act(async () => fireEvent.press(scanButton));
      fireEvent(getByTestId(barcodeScannerId), "onBarCodeScanned", {
        nativeEvent: { data: `{"key": "${key}","endpoint": "${endpoint}"}` },
      });

      const loginSendOTPButton = getByTestId(loginSendOTPButtonId);
      const countryCodeInput = getByTestId(countryCodeInputId);
      fireEvent(countryCodeInput, "onChangeCountryCode", countryCode);
      fireEvent.press(loginSendOTPButton);
      expect(queryByText("Enter a valid contact number.")).not.toBeNull();
    });

    it("otp is invalid", async () => {
      expect.assertions(2);
      mockRequestOTP.mockResolvedValueOnce({ status: "OK" });
      mockValidateOTP.mockRejectedValueOnce(
        new auth.OTPWrongError("Enter OTP again.", false)
      );

      const { getByTestId, queryByText } = render(
        <CreateProvidersWrapper
          providers={[{ provider: AlertModalContextProvider }]}
        >
          <InitialisationContainer
            navigation={mockNavigation}
            route={mockRoute}
          />
        </CreateProvidersWrapper>
      );
      const scanButton = getByTestId(scanButtonId);
      await act(async () => fireEvent.press(scanButton));
      fireEvent(getByTestId(barcodeScannerId), "onBarCodeScanned", {
        nativeEvent: { data: `{"key": "${key}","endpoint": "${endpoint}"}` },
      });

      const phoneNumberInput = getByTestId(phoneInputId);
      const loginSendOTPButton = getByTestId(loginSendOTPButtonId);
      fireEvent(phoneNumberInput, "onChangeText", phoneNumber);
      fireEvent.press(loginSendOTPButton);
      await act(async () => fireEvent.press(loginSendOTPButton));

      const OTPInput = getByTestId(OTPInputId);
      fireEvent(OTPInput, "onChange", {
        nativeEvent: { text: otp },
      });
      await act(async () =>
        fireEvent.press(getByTestId(loginSubmitOTPButtonId))
      );
      expect(queryByText("Enter OTP again.")).not.toBeNull();
      expect(mockCaptureException).toHaveBeenCalledTimes(1);
    });

    it("enter invalid otp for too many times", async () => {
      expect.assertions(3);
      mockRequestOTP.mockResolvedValueOnce({ status: "OK" });
      mockValidateOTP.mockRejectedValue(
        new auth.OTPWrongError("Wrong OTP entered, last try remaining", true)
      );

      const { getByTestId, queryByText } = render(
        <CreateProvidersWrapper
          providers={[{ provider: AlertModalContextProvider }]}
        >
          <InitialisationContainer
            navigation={mockNavigation}
            route={mockRoute}
          />
        </CreateProvidersWrapper>
      );
      const scanButton = getByTestId(scanButtonId);
      await act(async () => fireEvent.press(scanButton));
      fireEvent(getByTestId(barcodeScannerId), "onBarCodeScanned", {
        nativeEvent: { data: `{"key": "${key}","endpoint": "${endpoint}"}` },
      });

      const phoneNumberInput = getByTestId(phoneInputId);
      const loginSendOTPButton = getByTestId(loginSendOTPButtonId);
      fireEvent(phoneNumberInput, "onChangeText", phoneNumber);
      fireEvent.press(loginSendOTPButton);
      await act(async () => fireEvent.press(loginSendOTPButton));

      const OTPInput = getByTestId(OTPInputId);
      fireEvent(OTPInput, "onChange", {
        nativeEvent: { text: otp },
      });
      await act(async () =>
        fireEvent.press(getByTestId(loginSubmitOTPButtonId))
      );
      expect(queryByText("Invalid input")).not.toBeNull();
      expect(
        queryByText(
          "Enter OTP again. After 1 more invalid OTP entry, you will have to wait 3 minutes before trying again."
        )
      ).not.toBeNull();
      expect(mockCaptureException).toHaveBeenCalledTimes(1);
    });

    it("if network request fails when requesting for otp", async () => {
      expect.assertions(2);
      mockRequestOTP.mockRejectedValueOnce(
        new NetworkError("Network request failed")
      );

      const { getByTestId, queryByText } = render(
        <CreateProvidersWrapper
          providers={[{ provider: AlertModalContextProvider }]}
        >
          <InitialisationContainer
            navigation={mockNavigation}
            route={mockRoute}
          />
        </CreateProvidersWrapper>
      );
      const scanButton = getByTestId(scanButtonId);
      await act(async () => fireEvent.press(scanButton));
      fireEvent(getByTestId(barcodeScannerId), "onBarCodeScanned", {
        nativeEvent: { data: `{"key": "${key}","endpoint": "${endpoint}"}` },
      });

      const phoneNumberInput = getByTestId(phoneInputId);
      const loginSendOTPButton = getByTestId(loginSendOTPButtonId);
      fireEvent(phoneNumberInput, "onChangeText", phoneNumber);
      fireEvent.press(loginSendOTPButton);
      await act(async () => fireEvent.press(loginSendOTPButton));

      expect(queryByText("System error")).not.toBeNull();
      expect(
        queryByText(
          "We are currently facing connectivity issues.\nTry again later or contact your in-charge if the problem persists."
        )
      ).not.toBeNull();
      // TODO: add sentry for this flow
    });

    it("OTP is less than 6 digits", async () => {
      expect.assertions(3);
      mockRequestOTP.mockResolvedValueOnce({ status: "OK" });
      mockValidateOTP.mockRejectedValue(
        new auth.OTPWrongError("OTP must be 6 digits", false)
      );

      const { getByTestId, queryByText } = render(
        <CreateProvidersWrapper
          providers={[{ provider: AlertModalContextProvider }]}
        >
          <InitialisationContainer
            navigation={mockNavigation}
            route={mockRoute}
          />
        </CreateProvidersWrapper>
      );
      const scanButton = getByTestId(scanButtonId);
      await act(async () => fireEvent.press(scanButton));
      fireEvent(getByTestId(barcodeScannerId), "onBarCodeScanned", {
        nativeEvent: { data: `{"key": "${key}","endpoint": "${endpoint}"}` },
      });

      const phoneNumberInput = getByTestId(phoneInputId);
      const loginSendOTPButton = getByTestId(loginSendOTPButtonId);
      fireEvent(phoneNumberInput, "onChangeText", phoneNumber);
      fireEvent.press(loginSendOTPButton);
      await act(async () => fireEvent.press(loginSendOTPButton));

      const OTPInput = getByTestId(OTPInputId);
      fireEvent(OTPInput, "onChange", {
        nativeEvent: { text: "00" },
      });
      await act(async () =>
        fireEvent.press(getByTestId(loginSubmitOTPButtonId))
      );
      expect(queryByText("Invalid input")).not.toBeNull();
      expect(queryByText("Enter OTP again.")).not.toBeNull();
      expect(mockCaptureException).toHaveBeenCalledTimes(1);
    });

    it("OTP has expired", async () => {
      expect.assertions(3);
      mockRequestOTP.mockResolvedValueOnce({ status: "OK" });
      mockValidateOTP.mockRejectedValue(
        new auth.OTPExpiredError("OTP expired")
      );

      const { getByTestId, queryByText } = render(
        <CreateProvidersWrapper
          providers={[{ provider: AlertModalContextProvider }]}
        >
          <InitialisationContainer
            navigation={mockNavigation}
            route={mockRoute}
          />
        </CreateProvidersWrapper>
      );
      const scanButton = getByTestId(scanButtonId);
      await act(async () => fireEvent.press(scanButton));
      fireEvent(getByTestId(barcodeScannerId), "onBarCodeScanned", {
        nativeEvent: { data: `{"key": "${key}","endpoint": "${endpoint}"}` },
      });

      const phoneNumberInput = getByTestId(phoneInputId);
      const loginSendOTPButton = getByTestId(loginSendOTPButtonId);
      fireEvent(phoneNumberInput, "onChangeText", phoneNumber);
      fireEvent.press(loginSendOTPButton);
      await act(async () => fireEvent.press(loginSendOTPButton));

      const OTPInput = getByTestId(OTPInputId);
      fireEvent(OTPInput, "onChange", {
        nativeEvent: { text: otp },
      });
      await act(async () =>
        fireEvent.press(getByTestId(loginSubmitOTPButtonId))
      );
      expect(queryByText("Expired")).not.toBeNull();
      expect(queryByText("Get a new OTP and try again.")).not.toBeNull();
      expect(mockCaptureException).toHaveBeenCalledTimes(1);
    });

    it("entered OTP is empty", async () => {
      expect.assertions(3);
      mockRequestOTP.mockResolvedValueOnce({ status: "OK" });
      mockValidateOTP.mockRejectedValue(
        new auth.OTPEmptyError("OTP cannot be empty")
      );

      const { getByTestId, queryByText } = render(
        <CreateProvidersWrapper
          providers={[{ provider: AlertModalContextProvider }]}
        >
          <InitialisationContainer
            navigation={mockNavigation}
            route={mockRoute}
          />
        </CreateProvidersWrapper>
      );
      const scanButton = getByTestId(scanButtonId);
      await act(async () => fireEvent.press(scanButton));
      fireEvent(getByTestId(barcodeScannerId), "onBarCodeScanned", {
        nativeEvent: { data: `{"key": "${key}","endpoint": "${endpoint}"}` },
      });

      const phoneNumberInput = getByTestId(phoneInputId);
      const loginSendOTPButton = getByTestId(loginSendOTPButtonId);
      fireEvent(phoneNumberInput, "onChangeText", phoneNumber);
      fireEvent.press(loginSendOTPButton);
      await act(async () => fireEvent.press(loginSendOTPButton));
      await act(async () =>
        fireEvent.press(getByTestId(loginSubmitOTPButtonId))
      );
      expect(queryByText("Invalid input")).not.toBeNull();
      expect(queryByText("Enter OTP again.")).not.toBeNull();
      expect(mockCaptureException).toHaveBeenCalledTimes(1);
    });

    it("user locked from entering OTP and should return to LoginScanCard", async () => {
      expect.assertions(4);
      mockRequestOTP.mockResolvedValueOnce({ status: "OK" });
      mockValidateOTP.mockRejectedValue(
        new auth.LoginLockedError("Try again in 3 minutes.")
      );

      const { getByTestId, queryByText } = render(
        <CreateProvidersWrapper
          providers={[{ provider: AlertModalContextProvider }]}
        >
          <InitialisationContainer
            navigation={mockNavigation}
            route={mockRoute}
          />
        </CreateProvidersWrapper>
      );
      const scanButton = getByTestId(scanButtonId);
      await act(async () => fireEvent.press(scanButton));
      fireEvent(getByTestId(barcodeScannerId), "onBarCodeScanned", {
        nativeEvent: { data: `{"key": "${key}","endpoint": "${endpoint}"}` },
      });

      const phoneNumberInput = getByTestId(phoneInputId);
      const loginSendOTPButton = getByTestId(loginSendOTPButtonId);
      fireEvent(phoneNumberInput, "onChangeText", phoneNumber);
      fireEvent.press(loginSendOTPButton);
      await act(async () => fireEvent.press(loginSendOTPButton));

      const OTPInput = getByTestId(OTPInputId);
      fireEvent(OTPInput, "onChange", {
        nativeEvent: { text: otp },
      });
      await act(async () =>
        fireEvent.press(getByTestId(loginSubmitOTPButtonId))
      );
      expect(queryByText("Disabled access")).not.toBeNull();
      expect(queryByText("Try again in 3 minutes.")).not.toBeNull();
      expect(mockCaptureException).toHaveBeenCalledTimes(1);

      fireEvent.press(getByTestId(alertModelButtonId));
      expect(getByTestId(loginScanViewId)).not.toBeNull();
    });
  });
});
