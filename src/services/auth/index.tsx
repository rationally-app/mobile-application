import { IS_MOCK } from "../../config";
import * as t from "io-ts";
import { SessionCredentials } from "../../types";
import { fetchWithValidator } from "../helpers";

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
): Promise<unknown> => {
  const payload = { code, phone: mobileNumber };
  try {
    const response = await fetchWithValidator(
      t.unknown,
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
): Promise<unknown> => {
  return Promise.resolve();
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
