import { IS_MOCK } from "../../config";
import { SessionCredentials, OTPResponse } from "../../types";
import { fetchWithValidator, ValidationError } from "../helpers";
import { Sentry } from "../../utils/errorTracking";
import { AlertModalProps } from "../../components/AlertModal/AlertModal";
import { defaultWarningProps, duplicateAlertProps } from "../../context/alert";

export class LoginError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LoginError";
  }
}

export class LoginLockedError extends LoginError {
  constructor(message: string) {
    super(message);
    this.name = "LoginLockedError";
  }
  alertProps: AlertModalProps = {
    ...defaultWarningProps,
    description: this.message,
    visible: true
  };
}

export class AuthTakenError extends LoginError {
  constructor(message: string) {
    super(message);
    this.name = "AuthTakenError";
  }
  alertProps: AlertModalProps = {
    ...duplicateAlertProps,
    description:
      "Get a new QR code that is not tagged to any contact number from your in-charge.",
    visible: true
  };
}

export const liveRequestOTP = async (
  mobileNumber: string,
  code: string,
  endpoint: string
): Promise<OTPResponse> => {
  const payload = { code, phone: mobileNumber };
  try {
    const response = await fetchWithValidator(
      OTPResponse,
      `${endpoint}/auth/register`,
      {
        method: "POST",
        body: JSON.stringify(payload)
      }
    );
    return response;
  } catch (e) {
    if (e.message === "Auth token already in use") {
      throw new AuthTakenError(e.message);
    } else if (e.message.match(/Try again in [1-9] minutes?\./)) {
      throw new LoginLockedError(e.message);
    } else {
      throw new LoginError(e.message);
    }
  }
};

export const mockRequestOTP = async (
  _mobileNumber: string,
  _key: string,
  _endpoint: string
): Promise<OTPResponse> => {
  return { status: "OK" };
};

export const liveValidateOTP = async (
  otp: string,
  mobileNumber: string,
  code: string,
  endpoint: string
): Promise<SessionCredentials> => {
  const payload = { code, otp, phone: mobileNumber };
  try {
    const response = await fetchWithValidator(
      SessionCredentials,
      `${endpoint}/auth/confirm`,
      {
        method: "POST",
        body: JSON.stringify(payload)
      }
    );
    return response;
  } catch (e) {
    if (e instanceof ValidationError) {
      Sentry.captureException(e);
    }
    if (e.message.match(/Try again in [1-9] minutes?\./)) {
      throw new LoginLockedError(e.message);
    } else {
      throw new LoginError(e.message);
    }
  }
};

export const mockValidateOTP = async (
  _otp: string,
  _mobileNumber: string,
  _key: string,
  _endpoint: string
): Promise<SessionCredentials> => {
  return {
    sessionToken: "some-valid-session-token",
    ttl: new Date(2030, 0, 1)
  };
};

export const requestOTP = IS_MOCK ? mockRequestOTP : liveRequestOTP;
export const validateOTP = IS_MOCK ? mockValidateOTP : liveValidateOTP;
