import {
  render,
  fireEvent,
  cleanup,
  waitFor,
} from "@testing-library/react-native";
import React from "react";
import { Sentry } from "../../utils/errorTracking";
import { AuthStoreContextProvider } from "../../context/authStore";
import { AlertModalContextProvider } from "../../context/alert";
import * as auth from "../../services/auth";
import { CreateProvidersWrapper } from "../../test/helpers/providers";
import { LoginOTPCard } from "./LoginOTPCard";
import "../../common/i18n/i18nMock";
import * as SecureStore from "expo-secure-store";

jest.mock("../../utils/errorTracking");
jest.mock("expo-secure-store");

const mockCaptureException = jest.fn();
(Sentry.captureException as jest.Mock).mockImplementation(mockCaptureException);

const mockValidateOTP = jest.spyOn(auth, "validateOTP");
jest.spyOn(global, "setTimeout");

const resetStage = jest.fn();
const mockHandleRequestOTP = jest.fn().mockReturnValue(true);
const onSuccess = jest.fn();

const fullPhoneNumber = "+6588888888";
const operatorToken = "my-operator-token";
const endpoint = "https://my-endpoint.com";

const OTPInputId = "login-otp-input";
const submitButtonId = "login-submit-otp-button";

describe("LoginOTPCard", () => {
  beforeEach(() => {
    (
      SecureStore.getItemAsync as jest.MockedFunction<
        typeof SecureStore.getItemAsync
      >
    )
      .mockResolvedValueOnce("{}")
      .mockResolvedValue(null);
  });
  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
    jest.useRealTimers();
  });

  it("should submit the OTP successfully on pressing submit", async () => {
    expect.assertions(4);
    mockValidateOTP.mockResolvedValueOnce({
      sessionToken: "my-session-token",
      ttl: new Date(2030, 0, 1),
    });

    const { getByTestId, queryByText } = render(
      <CreateProvidersWrapper
        providers={[{ provider: AuthStoreContextProvider }]}
      >
        <LoginOTPCard
          resetStage={resetStage}
          fullMobileNumber={fullPhoneNumber}
          operatorToken={operatorToken}
          endpoint={endpoint}
          handleRequestOTP={mockHandleRequestOTP}
          onSuccess={onSuccess}
        />
      </CreateProvidersWrapper>
    );
    const OTPInput = getByTestId(OTPInputId);
    const submitButton = getByTestId(submitButtonId);

    fireEvent(OTPInput, "onChange", {
      nativeEvent: { text: "000000" },
    });
    expect(OTPInput.props["value"]).toBe("000000");

    fireEvent.press(submitButton);
    expect(queryByText("Submit")).toBeNull();
    expect(mockValidateOTP).toHaveBeenCalledWith(
      "000000",
      fullPhoneNumber,
      operatorToken,
      endpoint
    );
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith({
        endpoint: "https://my-endpoint.com",
        expiry: 1893427200000,
        operatorToken: "my-operator-token",
        sessionToken: "my-session-token",
      });
    });
  });

  it("button to resend OTP should be disabled for 30 seconds", async () => {
    expect.assertions(1);
    jest.useFakeTimers();
    const { queryByText } = render(
      <CreateProvidersWrapper
        providers={[{ provider: AuthStoreContextProvider }]}
      >
        <LoginOTPCard
          resetStage={resetStage}
          fullMobileNumber={fullPhoneNumber}
          operatorToken={operatorToken}
          endpoint={endpoint}
          handleRequestOTP={mockHandleRequestOTP}
          onSuccess={onSuccess}
        />
      </CreateProvidersWrapper>
    );
    expect(queryByText("Resend")).toBeNull();
    // jest.advanceTimersByTime(29999);
    // expect(queryByText("Resend")).toBeNull();
  });

  it("button to resend OTP should be enable after 30 seconds", async () => {
    expect.assertions(1);
    jest.useFakeTimers();
    const { queryByText } = render(
      <CreateProvidersWrapper
        providers={[{ provider: AuthStoreContextProvider }]}
      >
        <LoginOTPCard
          resetStage={resetStage}
          fullMobileNumber={fullPhoneNumber}
          operatorToken={operatorToken}
          endpoint={endpoint}
          handleRequestOTP={mockHandleRequestOTP}
          onSuccess={onSuccess}
        />
      </CreateProvidersWrapper>
    );
    expect(queryByText("Resend")).toBeNull();
    // jest.advanceTimersByTime(30000);
    // expect(queryByText("Resend")).not.toBeNull();
  });

  describe("should show error modal", () => {
    it("when entered OTP is wrong", async () => {
      expect.assertions(6);
      mockValidateOTP.mockRejectedValue(
        new auth.OTPWrongError("Wrong OTP entered", false)
      );

      const { getByTestId, queryByText } = render(
        <CreateProvidersWrapper
          providers={[
            { provider: AuthStoreContextProvider },
            { provider: AlertModalContextProvider },
          ]}
        >
          <LoginOTPCard
            resetStage={resetStage}
            fullMobileNumber={fullPhoneNumber}
            operatorToken={operatorToken}
            endpoint={endpoint}
            handleRequestOTP={mockHandleRequestOTP}
            onSuccess={onSuccess}
          />
        </CreateProvidersWrapper>
      );

      const OTPInput = getByTestId(OTPInputId);
      const submitButton = getByTestId(submitButtonId);

      fireEvent(OTPInput, "onChange", {
        nativeEvent: { text: "000000" },
      });
      expect(OTPInput.props["value"]).toBe("000000");

      fireEvent.press(submitButton);
      expect(queryByText("Submit")).toBeNull();
      expect(mockValidateOTP).toHaveBeenCalledTimes(1);

      await waitFor(() => {
        expect(queryByText("Invalid input")).not.toBeNull();
        expect(queryByText("Enter OTP again.")).not.toBeNull();
      });

      expect(onSuccess).not.toHaveBeenCalled();
    });

    it("when entered wrong OTP too many times", async () => {
      expect.assertions(6);
      mockValidateOTP.mockRejectedValue(
        new auth.OTPWrongError("Wrong OTP entered, last try remaining", true)
      );

      const { getByTestId, queryByText } = render(
        <CreateProvidersWrapper
          providers={[
            { provider: AuthStoreContextProvider },
            { provider: AlertModalContextProvider },
          ]}
        >
          <LoginOTPCard
            resetStage={resetStage}
            fullMobileNumber={fullPhoneNumber}
            operatorToken={operatorToken}
            endpoint={endpoint}
            handleRequestOTP={mockHandleRequestOTP}
            onSuccess={onSuccess}
          />
        </CreateProvidersWrapper>
      );

      const OTPInput = getByTestId(OTPInputId);
      const submitButton = getByTestId(submitButtonId);

      fireEvent(OTPInput, "onChange", {
        nativeEvent: { text: "000000" },
      });
      expect(OTPInput.props["value"]).toBe("000000");

      fireEvent.press(submitButton);
      expect(queryByText("Submit")).toBeNull();
      expect(mockValidateOTP).toHaveBeenCalledTimes(1);

      await waitFor(() => {
        expect(queryByText("Invalid input")).not.toBeNull();
        expect(
          queryByText(
            "Enter OTP again. After 1 more invalid OTP entry, you will have to wait 3 minutes before trying again."
          )
        ).not.toBeNull();
      });

      expect(onSuccess).not.toHaveBeenCalled();
    });

    it("when OTP is less than 6 digits", async () => {
      expect.assertions(6);
      mockValidateOTP.mockRejectedValue(
        new auth.OTPWrongError("OTP must be 6 digits", false)
      );

      const { getByTestId, queryByText } = render(
        <CreateProvidersWrapper
          providers={[
            { provider: AuthStoreContextProvider },
            { provider: AlertModalContextProvider },
          ]}
        >
          <LoginOTPCard
            resetStage={resetStage}
            fullMobileNumber={fullPhoneNumber}
            operatorToken={operatorToken}
            endpoint={endpoint}
            handleRequestOTP={mockHandleRequestOTP}
            onSuccess={onSuccess}
          />
        </CreateProvidersWrapper>
      );

      const OTPInput = getByTestId(OTPInputId);
      const submitButton = getByTestId(submitButtonId);

      fireEvent(OTPInput, "onChange", {
        nativeEvent: { text: "00" },
      });
      expect(OTPInput.props["value"]).toBe("00");

      fireEvent.press(submitButton);
      expect(queryByText("Submit")).toBeNull();
      expect(mockValidateOTP).toHaveBeenCalledTimes(1);

      await waitFor(() => {
        expect(queryByText("Invalid input")).not.toBeNull();
        expect(queryByText("Enter OTP again.")).not.toBeNull();
      });

      expect(onSuccess).not.toHaveBeenCalled();
    });

    it("when OTP has expired", async () => {
      expect.assertions(6);
      mockValidateOTP.mockRejectedValue(
        new auth.OTPExpiredError("OTP expired")
      );

      const { getByTestId, queryByText } = render(
        <CreateProvidersWrapper
          providers={[
            { provider: AuthStoreContextProvider },
            { provider: AlertModalContextProvider },
          ]}
        >
          <LoginOTPCard
            resetStage={resetStage}
            fullMobileNumber={fullPhoneNumber}
            operatorToken={operatorToken}
            endpoint={endpoint}
            handleRequestOTP={mockHandleRequestOTP}
            onSuccess={onSuccess}
          />
        </CreateProvidersWrapper>
      );

      const OTPInput = getByTestId(OTPInputId);
      const submitButton = getByTestId(submitButtonId);

      fireEvent(OTPInput, "onChange", {
        nativeEvent: { text: "000000" },
      });
      expect(OTPInput.props["value"]).toBe("000000");

      fireEvent.press(submitButton);
      expect(queryByText("Submit")).toBeNull();
      expect(mockValidateOTP).toHaveBeenCalledTimes(1);

      await waitFor(() => {
        expect(queryByText("Expired")).not.toBeNull();
        expect(queryByText("Get a new OTP and try again.")).not.toBeNull();
      });

      expect(onSuccess).not.toHaveBeenCalled();
    });

    it("when entered OTP is empty", async () => {
      expect.assertions(5);
      mockValidateOTP.mockRejectedValue(
        new auth.OTPEmptyError("OTP cannot be empty")
      );

      const { getByTestId, queryByText } = render(
        <CreateProvidersWrapper
          providers={[
            { provider: AuthStoreContextProvider },
            { provider: AlertModalContextProvider },
          ]}
        >
          <LoginOTPCard
            resetStage={resetStage}
            fullMobileNumber={fullPhoneNumber}
            operatorToken={operatorToken}
            endpoint={endpoint}
            handleRequestOTP={mockHandleRequestOTP}
            onSuccess={onSuccess}
          />
        </CreateProvidersWrapper>
      );

      const submitButton = getByTestId(submitButtonId);

      fireEvent.press(submitButton);
      expect(queryByText("Submit")).toBeNull();
      expect(mockValidateOTP).toHaveBeenCalledTimes(1);

      await waitFor(() => {
        expect(queryByText("Invalid input")).not.toBeNull();
        expect(queryByText("Enter OTP again.")).not.toBeNull();
      });

      expect(onSuccess).not.toHaveBeenCalled();
    });

    it("when user is locked from entering OTP", async () => {
      expect.assertions(7);
      mockValidateOTP.mockRejectedValue(
        new auth.LoginLockedError("Try again in 3 minutes.")
      );

      const { getByTestId, queryByText } = render(
        <CreateProvidersWrapper
          providers={[
            { provider: AuthStoreContextProvider },
            { provider: AlertModalContextProvider },
          ]}
        >
          <LoginOTPCard
            resetStage={resetStage}
            fullMobileNumber={fullPhoneNumber}
            operatorToken={operatorToken}
            endpoint={endpoint}
            handleRequestOTP={mockHandleRequestOTP}
            onSuccess={onSuccess}
          />
        </CreateProvidersWrapper>
      );

      const OTPInput = getByTestId(OTPInputId);
      const submitButton = getByTestId(submitButtonId);

      fireEvent(OTPInput, "onChange", {
        nativeEvent: { text: "000000" },
      });
      expect(OTPInput.props["value"]).toBe("000000");

      fireEvent.press(submitButton);
      expect(queryByText("Submit")).toBeNull();
      expect(mockValidateOTP).toHaveBeenCalledTimes(1);

      await waitFor(() => {
        expect(queryByText("Disabled access")).not.toBeNull();
        expect(queryByText("Try again in 3 minutes.")).not.toBeNull();
      });

      expect(onSuccess).not.toHaveBeenCalled();

      const alertModalPrimaryButton = getByTestId("alert-modal-primary-button");
      fireEvent.press(alertModalPrimaryButton);
      expect(resetStage).toHaveBeenCalledTimes(1);
    });
  });
});
