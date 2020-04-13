import { IS_MOCK } from "../../config";

export interface ValidateOTPResponse {
  sessionToken: string;
  ttl: number;
}

export const liveRequestOTP = async (
  mobileNumber: string,
  code: string,
  endpoint: string
): Promise<void> => {
  const payload = { code, phone: mobileNumber };
  await fetch(`${endpoint}/auth/register`, {
    method: "POST",
    body: JSON.stringify(payload)
  }).then(response => {
    if (response.ok) {
      return response.json();
    }
    return response.json().then(error => {
      throw new Error(error.message);
    });
  });
};

export const liveValidateOTP = async (
  otp: string,
  mobileNumber: string,
  code: string,
  endpoint: string
): Promise<ValidateOTPResponse> => {
  const payload = { code, otp, phone: mobileNumber };
  const response = await fetch(`${endpoint}/auth/confirm`, {
    method: "POST",
    body: JSON.stringify(payload)
  }).then(response => {
    if (response.ok) {
      return response.json();
    }
    return response.json().then(error => {
      throw new Error(error.message);
    });
  });
  return response;
};

export const mockValidateOTP = async (
  _otp: string,
  _mobileNumber: string,
  _key: string,
  _endpoint: string
): Promise<ValidateOTPResponse> => {
  return {
    sessionToken: "some-valid-session-token",
    ttl: 1686259452317
  };
};

export const mockRequestOTP = async (
  _mobileNumber: string,
  _key: string,
  _endpoint: string
): Promise<void> => {
  Promise.resolve();
};

export const requestOTP = IS_MOCK ? mockRequestOTP : liveRequestOTP;
export const validateOTP = IS_MOCK ? mockValidateOTP : liveValidateOTP;
