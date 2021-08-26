import { IS_MOCK } from "../../config";
import { SessionCredentials, OTPResponse, LogoutResponse } from "../../types";
import {
  fetchWithValidator,
  NetworkError,
  SessionError,
  ValidationError,
} from "../helpers";
import { Sentry } from "../../utils/errorTracking";

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
  }
}

export class AuthExpiredError extends AuthError {
  constructor(message: string) {
    super(message);
    this.name = "AuthExpiredError";
  }
}

export class AuthNotFoundError extends AuthError {
  constructor(message: string) {
    super(message);
    this.name = "AuthNotFoundError";
  }
}

export class AuthInvalidError extends AuthError {
  constructor(message: string) {
    super(message);
    this.name = "AuthInvalidError";
  }
}

export class OTPWrongError extends LoginError {
  constructor(message: string, isLastTry: boolean) {
    super(message);
    this.name = isLastTry ? "OTPWrongErrorLastTry" : "OTPWrongError";
  }
}

export class OTPExpiredError extends LoginError {
  constructor(message: string) {
    super(message);
    this.name = "OTPExpiredError";
  }
}

export class OTPEmptyError extends LoginError {
  constructor(message: string) {
    super(message);
    this.name = "OTPEmptyError";
  }
}

export class LogoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LogoutError";
  }
}

export class OperatorTokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OperatorTokenError";
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
        body: JSON.stringify(payload),
      }
    );
    return response;
  } catch (e) {
    if (e.message === "Auth token already in use") {
      throw new AuthTakenError(e.message);
    } else if (e.message === "Auth token is not currently valid") {
      throw new AuthExpiredError(e.message);
    } else if (
      e.message === "No user found" ||
      e.message === "Unauthorized auth token"
    ) {
      throw new AuthNotFoundError(e.message);
    } else if (e.message === "Auth token is of invalid format") {
      // this should not happen since we check the format before coming to this stage
      throw new AuthInvalidError(e.message);
    } else if (e.message.match(/Try again in [1-9] minutes?\./)) {
      const minutes = e.message.match(/\d+/);
      throw new LoginLockedError(minutes);
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
  Sentry.addBreadcrumb({
    category: "otpValidate",
    message: JSON.stringify(payload),
  });
  try {
    const response = await fetchWithValidator(
      SessionCredentials,
      `${endpoint}/auth/confirm`,
      {
        method: "POST",
        body: JSON.stringify(payload),
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
    } else if (e.message === "OTP expired") {
      throw new OTPExpiredError(e.message);
    } else if (e.message === "OTP cannot be empty") {
      throw new OTPEmptyError(e.message);
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
    ttl: new Date(2030, 0, 1),
  };
};

/** Error message returned by endpoints without a /auth/logout handler */
const oldBackendError =
  "Authorization header requires 'Credential' parameter. Authorization header requires 'Signature' parameter. Authorization header requires 'SignedHeaders' parameter. Authorization header requires existence of either a 'X-Amz-Date' or a 'Date' header. Authorization=";

export const liveCallLogout = async (
  sessionToken: string,
  operatorToken: string,
  endpoint: string
): Promise<void> => {
  const payload = { sessionToken, operatorToken };

  try {
    await fetchWithValidator(LogoutResponse, `${endpoint}/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: sessionToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        operatorToken,
      }),
    });
    Sentry.addBreadcrumb({
      category: "logout",
      message: JSON.stringify({
        status: "success",
        ...payload,
        endpoint,
      }),
    });
    return;
  } catch (e) {
    if (e instanceof NetworkError) {
      throw e;
    } else if (
      e instanceof SessionError ||
      e.message === "Auth token is not currently valid" ||
      e.message === oldBackendError + sessionToken
    ) {
      // for this case the session token is already invalidated or past the valid date
      // TODO: <logout> is it safe to keep session token there if already past validity date
      // in such cases, session token already can't be used anyway
      Sentry.addBreadcrumb({
        category: "logout",
        message: JSON.stringify({
          status: "session token already invalid on server",
          message: e.message,
          ...payload,
          endpoint,
        }),
      });
      return;
    } else if (
      e.message === "Operator tokens are mismatched" ||
      e.message === "Operator token is missing"
    ) {
      // these shouldn't happen because the operator token should be correct
      Sentry.addBreadcrumb({
        category: "logout",
        message: JSON.stringify({
          status: "operator token error",
          message: e.message,
          ...payload,
          endpoint,
        }),
      });
      throw new OperatorTokenError(e.message);
    } else {
      Sentry.addBreadcrumb({
        category: "logout",
        message: JSON.stringify({
          status: "failed",
          message: e.message,
          ...payload,
          endpoint,
        }),
      });
      throw new LogoutError(e.message);
    }
  }
};

export const mockCallLogout = async (
  _sessionToken: string,
  _operatorToken: string,
  _endpoint: string
): Promise<void> => {
  // uncomment to test throwing an error
  // throw new LogoutError("error logging out");
};

export const requestOTP = IS_MOCK ? mockRequestOTP : liveRequestOTP;
export const validateOTP = IS_MOCK ? mockValidateOTP : liveValidateOTP;
export const callLogout = IS_MOCK ? mockCallLogout : liveCallLogout;
