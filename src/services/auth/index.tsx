import { IS_MOCK } from "../../config";
import { SessionCredentials, OPTResponse } from "../../types";
import { fetchWithValidator, ValidationError } from "../helpers";
import { Sentry } from "../../utils/errorTracking";

export class LoginError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LoginError";
  }
}

export const liveRequestOTP = async (
  mobileNumber: string,
  code: string,
  endpoint: string
): Promise<OPTResponse> => {
  const payload = { code, phone: mobileNumber };
  try {
    const response = await fetchWithValidator(
      OPTResponse,
      `${endpoint}/auth/register`,
      {
        method: "POST",
        body: JSON.stringify(payload)
      }
    );
    return response;
  } catch (e) {
    throw new LoginError(e.message);
  }
};

export const mockRequestOTP = async (
  _mobileNumber: string,
  _key: string,
  _endpoint: string
): Promise<OPTResponse> => {
  return {};
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
    throw new LoginError(e.message);
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
