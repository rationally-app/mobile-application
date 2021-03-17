import { render, fireEvent, cleanup } from "@testing-library/react-native";
import React from "react";
import { AlertModalContextProvider } from "../../context/alert";
import { validateOTP } from "../../services/auth";
import { CreateProvidersWrapper } from "../../test/helpers/providers";
import { LoginOTPCard } from "./LoginOTPCard";

jest.mock("../../services/auth");
const mockValidateOTP = validateOTP as jest.Mock;

const resetStage = jest.fn();
const mockHandleRequestOTP = jest.fn().mockReturnValue(true);
const onSuccess = jest.fn();

describe("LoginOTPCard", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    jest.useRealTimers();
    jest.resetAllMocks();
  });

  it("should be able to fetch the endpoint without error", async () => {
    expect.assertions(3);
    mockValidateOTP.mockReturnValueOnce({
      sessionToken: "a-session-token",
      ttl: new Date(2030, 0, 1),
    });

    const { getByTestId } = render(
      <LoginOTPCard
        resetStage={resetStage}
        fullMobileNumber={"6588888888"}
        operatorToken={"an-operator-token"}
        endpoint={"https://some-endpoint.com"}
        handleRequestOTP={mockHandleRequestOTP}
        onSuccess={onSuccess}
      />
    );
    const OTPInput = getByTestId("login-otp-input");
    const submitButton = getByTestId("login-submit-otp-button");
    await fireEvent(OTPInput, "onChange", {
      nativeEvent: { text: "000000" },
    });
    expect(OTPInput.props["value"]).toEqual("000000");

    await fireEvent.press(submitButton);
    expect(mockValidateOTP).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  describe("should show error modal", () => {
    it("when entered OTP is wrong", async () => {
      expect.assertions(4);
      mockValidateOTP.mockRejectedValueOnce(new Error("Wrong OTP entered"));

      const { getByTestId } = render(
        <CreateProvidersWrapper
          providers={[{ provider: AlertModalContextProvider }]}
        >
          <LoginOTPCard
            resetStage={resetStage}
            fullMobileNumber={"6588888888"}
            operatorToken={"an-operator-token"}
            endpoint={"https://some-endpoint.com"}
            handleRequestOTP={mockHandleRequestOTP}
            onSuccess={onSuccess}
          />
        </CreateProvidersWrapper>
      );

      const OTPInput = getByTestId("login-otp-input");
      const submitButton = getByTestId("login-submit-otp-button");
      const alertModal = getByTestId("alert-modal-primary-button");

      await fireEvent(OTPInput, "onChange", {
        nativeEvent: { text: "000000" },
      });
      expect(OTPInput.props["value"]).toEqual("000000");

      await fireEvent.press(submitButton);
      expect(mockValidateOTP).toHaveBeenCalledTimes(1);
      expect(alertModal).toBeTruthy();
      // TODO: compare the error message

      expect(onSuccess).not.toHaveBeenCalled();
    });

    it("when entered OTP is of invalid length", async () => {
      expect.hasAssertions();
      mockValidateOTP.mockRejectedValueOnce(new Error("Wrong OTP entered"));

      const { getByTestId } = render(
        <CreateProvidersWrapper
          providers={[{ provider: AlertModalContextProvider }]}
        >
          <LoginOTPCard
            resetStage={resetStage}
            fullMobileNumber={"6588888888"}
            operatorToken={"an-operator-token"}
            endpoint={"https://some-endpoint.com"}
            handleRequestOTP={mockHandleRequestOTP}
            onSuccess={onSuccess}
          />
        </CreateProvidersWrapper>
      );

      const OTPInput = getByTestId("login-otp-input");
      const submitButton = getByTestId("login-submit-otp-button");
      const alertModal = getByTestId("alert-modal-primary-button");

      await fireEvent(OTPInput, "onChange", { nativeEvent: { text: "123" } });
      expect(OTPInput.props["value"]).toEqual("123");

      await fireEvent.press(submitButton);
      expect(mockValidateOTP).toHaveBeenCalledTimes(1);
      expect(alertModal).toBeTruthy();
      // TODO: compare the error message

      expect(onSuccess).not.toHaveBeenCalled();
    });
  });
});
