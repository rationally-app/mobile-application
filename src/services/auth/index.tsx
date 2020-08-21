import { IS_MOCK } from "../../config";
import { SessionCredentials, OTPResponse } from "../../types";
import { fetchWithValidator, ValidationError } from "../helpers";
import { Sentry } from "../../utils/errorTracking";
import {
  duplicateAlertProps,
  ERROR_MESSAGE,
  systemAlertProps,
  wrongFormatAlertProps,
  invalidEntryAlertProps,
  disabledAccessAlertProps
} from "../../context/alert";

export class LoginError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LoginError";
  }
  alertProps = {
    ...systemAlertProps,
    description: this.message,
    visible: true
  };
}

export class LoginLockedError extends LoginError {
  constructor(message: string) {
    super(message);
    this.name = "LoginLockedError";
    this.alertProps = {
      ...disabledAccessAlertProps,
      description: this.message,
      visible: true
    };
  }
}

export class AuthError extends LoginError {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export class AuthTakenError extends AuthError {
  constructor(message: string) {
    super(message);
    this.name = "AuthTakenError";
    this.alertProps = {
      ...duplicateAlertProps,
      description: ERROR_MESSAGE.AUTH_FAILURE_TAKEN_TOKEN,
      visible: true
    };
  }
}

export class AuthExpiredError extends AuthError {
  constructor(message: string) {
    super(message);
    this.name = "AuthExpiredError";
    this.alertProps = {
      ...systemAlertProps,
      title: "Expired",
      description: ERROR_MESSAGE.AUTH_FAILURE_EXPIRED_TOKEN,
      visible: true
    };
  }
}

export class AuthNotFoundError extends AuthError {
  constructor(message: string) {
    super(message);
    this.name = "AuthNotFoundError";
    this.alertProps = {
      ...wrongFormatAlertProps,
      description: ERROR_MESSAGE.AUTH_FAILURE_INVALID_TOKEN,
      visible: true
    };
  }
}

export class AuthInvalidError extends AuthError {
  constructor(message: string) {
    super(message);
    this.name = "AuthInvalidError";
    this.alertProps = {
      ...wrongFormatAlertProps,
      description: ERROR_MESSAGE.AUTH_FAILURE_INVALID_FORMAT,
      visible: true
    };
  }
}

export class OTPWrongError extends LoginError {
  constructor(message: string, isLastTry: boolean) {
    super(message);
    this.name = "AuthInvalidError";
    this.alertProps = {
      ...invalidEntryAlertProps,
      description: isLastTry
        ? ERROR_MESSAGE.LAST_OTP_ERROR
        : ERROR_MESSAGE.OTP_ERROR,
      visible: true
    };
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
    if (e.message === "Auth token already in use") {
      throw new AuthTakenError(e.message);
    } else if (e.message === "Auth token is not currently valid") {
      throw new AuthExpiredError(e.message);
    } else if (e.message === "No user found") {
      throw new AuthNotFoundError(e.message);
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
    } else if (e.message === "Wrong OTP entered") {
      throw new OTPWrongError(e.message, false);
    } else if (e.message === "Wrong OTP entered, last try remaining") {
      throw new OTPWrongError(e.message, true);
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
