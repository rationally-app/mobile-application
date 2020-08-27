import { IS_MOCK } from "../../config";
import { SessionCredentials, OTPResponse } from "../../types";
import { fetchWithValidator, ValidationError } from "../helpers";
import { Sentry } from "../../utils/errorTracking";
import { ERROR_MESSAGE } from "../../context/alert";

export enum BACKEND_ERROR_MESSAGE {
  AUTH_NOT_FOUND = "No user found",
  AUTH_FAILURE_EXPIRED_TOKEN = "Auth token is not currently valid",
  AUTH_ROLE_UNAUTHORIZED = "Unauthorized auth token"
}
export class LoginError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LoginError";
  }
}

export class TokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TokenError";
  }
}

export class LoginLockedError extends LoginError {
  constructor(message: string) {
    super(message);
    this.name = "LoginLockedError";
  }
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
    if (e.message.includes("Please wait")) {
      throw new LoginLockedError(e.message);
      // non-operator role
    } else if (e.message === BACKEND_ERROR_MESSAGE.AUTH_ROLE_UNAUTHORIZED) {
      throw new TokenError(ERROR_MESSAGE.AUTH_FAILURE_INVALID_TOKEN);
    } else if (
      e.message === BACKEND_ERROR_MESSAGE.AUTH_NOT_FOUND ||
      e.message === BACKEND_ERROR_MESSAGE.AUTH_FAILURE_EXPIRED_TOKEN ||
      e instanceof SyntaxError
    ) {
      throw new TokenError(ERROR_MESSAGE.AUTH_FAILURE_INVALID_FORMAT);
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
    if (e.message.includes("Please wait")) {
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
