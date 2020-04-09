import { IS_MOCK } from "../../config";

export interface ValidateOTPResponse {
  session: string;
}

export const liveRequestOTP = async (
  mobileNumber: string,
  key: string,
  endpoint: string
): Promise<void> => {
  const payload = { code: key, phone: mobileNumber };
  const response = await fetch(`${endpoint}/auth/register`, {
    method: "POST",
    headers: {
      Authorization: key,
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error("Failed to generate OTP");
  }
};

export const liveValidateOTP = async (
  otp: string,
  mobileNumber: string,
  key: string,
  endpoint: string
): Promise<ValidateOTPResponse> => {
  const payload = { code: key, otp, phone: mobileNumber };
  const response = await fetch(`${endpoint}/auth/confirm`, {
    method: "POST",
    headers: {
      Authorization: key,
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error("OTP invalid");
  }
  return response.json();
};

export const mockValidateOTP = async (
  _otp: string,
  mobileNumber: string,
  _key: string,
  _endpoint: string
): Promise<ValidateOTPResponse> => {
  return {
    session: "some-valid-session",
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
