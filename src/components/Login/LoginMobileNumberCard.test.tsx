import { render, fireEvent, cleanup } from "@testing-library/react-native";
import React from "react";
import { Sentry } from "../../utils/errorTracking";
import { AlertModalContextProvider } from "../../context/alert";
import { CreateProvidersWrapper } from "../../test/helpers/providers";
import { LoginMobileNumberCard } from "./LoginMobileNumberCard";
import "../../common/i18n/i18nMock";

jest.mock("../../utils/errorTracking");
const mockCaptureException = jest.fn();
(Sentry.captureException as jest.Mock).mockImplementation(mockCaptureException);

const setLoginState = jest.fn();
const setMobileNumber = jest.fn();
const setCountryCode = jest.fn();
const mockHandleRequestOTP = jest.fn().mockReturnValue(true);

describe("LoginMobileNumberCard", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    jest.useRealTimers();
    jest.resetAllMocks();
  });

  it("should be able to fetch the endpoint without error", async () => {
    expect.assertions(5);
    const { getByTestId } = render(
      <LoginMobileNumberCard
        setLoginStage={setLoginState}
        setMobileNumber={setMobileNumber}
        setCountryCode={setCountryCode}
        handleRequestOTP={mockHandleRequestOTP}
      />
    );

    const phoneNumberInput = getByTestId("login-phone-number-input");
    const submitButton = getByTestId("login-send-otp-button");

    await fireEvent(phoneNumberInput, "onChangeText", "88888888");
    expect(phoneNumberInput.props["value"]).toEqual("8888 8888");

    await fireEvent.press(submitButton);
    expect(mockHandleRequestOTP).toHaveBeenCalledTimes(1);

    expect(setMobileNumber).toHaveBeenCalledWith("88888888");
    expect(setCountryCode).toHaveBeenCalledWith("+65");
    expect(setLoginState).toHaveBeenCalledWith("OTP");
  });

  describe("should show error modal", () => {
    it("when contact number phone number input is empty", async () => {
      expect.assertions(6);
      const { getByTestId, queryByText } = render(
        <CreateProvidersWrapper
          providers={[{ provider: AlertModalContextProvider }]}
        >
          <LoginMobileNumberCard
            setLoginStage={setLoginState}
            setMobileNumber={setMobileNumber}
            setCountryCode={setCountryCode}
            handleRequestOTP={mockHandleRequestOTP}
          />
        </CreateProvidersWrapper>
      );
      const phoneNumberInput = getByTestId("login-phone-number-input");
      const submitButton = getByTestId("login-send-otp-button");

      await fireEvent(phoneNumberInput, "onChangeText", "");
      expect(phoneNumberInput.props["value"]).toEqual("");

      await fireEvent.press(submitButton);
      expect(mockHandleRequestOTP).not.toHaveBeenCalled();
      expect(queryByText("Enter a valid contact number.")).not.toBeNull();

      expect(setMobileNumber).not.toHaveBeenCalled();
      expect(setCountryCode).not.toHaveBeenCalled();
      expect(setLoginState).not.toHaveBeenCalled();
    });

    it("when contact number phone number input is invalid", async () => {
      expect.assertions(6);
      const { getByTestId, queryByText } = render(
        <CreateProvidersWrapper
          providers={[{ provider: AlertModalContextProvider }]}
        >
          <LoginMobileNumberCard
            setLoginStage={setLoginState}
            setMobileNumber={setMobileNumber}
            setCountryCode={setCountryCode}
            handleRequestOTP={mockHandleRequestOTP}
          />
        </CreateProvidersWrapper>
      );
      const phoneNumberInput = getByTestId("login-phone-number-input");
      const submitButton = getByTestId("login-send-otp-button");

      await fireEvent(phoneNumberInput, "onChangeText", "888888888");
      expect(phoneNumberInput.props["value"]).toEqual("888888888");

      await fireEvent.press(submitButton);
      expect(mockHandleRequestOTP).not.toHaveBeenCalled();
      expect(queryByText("Enter a valid contact number.")).not.toBeNull();

      expect(setMobileNumber).not.toHaveBeenCalled();
      expect(setCountryCode).not.toHaveBeenCalled();
      expect(setLoginState).not.toHaveBeenCalled();
    });
  });
});
