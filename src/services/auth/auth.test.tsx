import { requestOTP, LoginError, validateOTP, callLogout, OperatorTokenError } from "./index";
import { Sentry } from "../../utils/errorTracking";
import { NetworkError, SessionError } from "../helpers";

jest.mock("../../utils/errorTracking");
const mockCaptureException = jest.fn();
(Sentry.captureException as jest.Mock).mockImplementation(mockCaptureException);

const mockFetch = jest.fn();
jest.spyOn(global, "fetch").mockImplementation(mockFetch);

const code = "ABC-123";
const phone = "+6591234567";
const otp = "123456";
const endpoint = "https://myendpoint.com";
const ttl = new Date(2030, 0, 1);
const sessionToken = "0000-11111-22222-33333-44444";
const warning = "warn!";
const status = "status";

describe("auth", () => {
  beforeEach(() => {
    mockFetch.mockReset();
    mockCaptureException.mockReset();
  });

  describe("requestOTP", () => {
    it("should return an object with a status key if the request is successful", async () => {
      expect.assertions(1);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ status }),
      });
      const response = await requestOTP(phone, code, endpoint);
      expect(response).toEqual({ status });
    });

    it("should return an object with warning and status keys if the request is successful and the next request will be the the last one before user is locked out", async () => {
      expect.assertions(1);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ warning, status }),
      });
      const response = await requestOTP(phone, code, endpoint);
      expect(response).toEqual({ warning, status });
    });

    it("should throw error if the returned value does not have a status key", async () => {
      expect.assertions(1);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      });
      await expect(requestOTP(phone, code, endpoint)).rejects.toThrow(
        LoginError
      );
    });

    it("should throw error if OTP could not be retrieved", async () => {
      expect.assertions(1);
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () =>
          Promise.resolve({
            message: "Cannot register another phone number to this code",
          }),
      });

      await expect(requestOTP(phone, code, endpoint)).rejects.toThrow(
        LoginError
      );
    });

    it("should throw error if there were issues fetching", async () => {
      expect.assertions(1);
      mockFetch.mockRejectedValueOnce(new Error("Network error"));
      await expect(requestOTP(phone, code, endpoint)).rejects.toThrow(
        "Network error"
      );
    });
  });

  describe("validateOTP", () => {
    it("should return the session credentials when OTP is validated", async () => {
      expect.assertions(1);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ sessionToken, ttl: ttl.getTime() }),
      });
      const credentials = await validateOTP(otp, phone, code, endpoint);
      expect(credentials).toEqual({ sessionToken, ttl });
    });

    it("should throw error if returned session credentials are malformed", async () => {
      expect.assertions(1);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            session: sessionToken,
            ttl: ttl.getTime(),
          }),
      });

      await expect(validateOTP(otp, phone, code, endpoint)).rejects.toThrow(
        LoginError
      );
    });

    it("should capture exception through sentry if session credentials are malformed", async () => {
      expect.assertions(2);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            session: sessionToken,
            ttl: ttl.getTime(),
          }),
      });

      await expect(validateOTP(otp, phone, code, endpoint)).rejects.toThrow(
        LoginError
      );
      expect(mockCaptureException).toHaveBeenCalledTimes(1);
    });

    it("should throw error if OTP validation failed", async () => {
      expect.assertions(1);
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () =>
          Promise.resolve({
            message: "OTP does not match",
          }),
      });

      await expect(validateOTP(otp, phone, code, endpoint)).rejects.toThrow(
        "OTP does not match"
      );
    });

    it("should throw error if there were issues fetching", async () => {
      expect.assertions(1);
      mockFetch.mockRejectedValueOnce(new Error("Network error"));
      await expect(validateOTP(otp, phone, code, endpoint)).rejects.toThrow(
        "Network error"
      );
    });
  });

  describe("callLogout", () => {
    it("should return normally upon successful logout", async () => {
      expect.assertions(1);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ status: "OK" })
      });
      await expect(callLogout(sessionToken, code, endpoint)).resolves.toEqual(undefined);

    });

    it("should return normally if SessionError received", async () => {
      expect.assertions(1);
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({
          message: "Invalid authentication token provided"
        })
      });
      await expect(callLogout(sessionToken, code, endpoint)).resolves.toEqual(undefined);
    });

    it("should return normally if Expired error received", async () => {
      expect.assertions(1);
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({
          message: "Auth token is not currently valid"
        })
      });
      await expect(callLogout(sessionToken, code, endpoint)).resolves.toEqual(undefined);
    });

    it("should throw error if operator token error received", async () => {
      expect.assertions(1);
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({
          message: "Unauthorized auth token"
        })
      });
      await expect(callLogout(sessionToken, code, endpoint)).rejects.toThrow(OperatorTokenError);
    });

    it("should throw an error if missing operator token error received", async () => {
      expect.assertions(1);
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({
          message: "Auth token is of invalid format"
        })
      });
      await expect(callLogout(sessionToken, code, endpoint)).rejects.toThrow(OperatorTokenError);
    });

    it("should throw network error if network error received", async () => {
      expect.assertions(1);
      mockFetch.mockRejectedValueOnce(new NetworkError(""));
      await expect(callLogout(sessionToken, code, endpoint)).rejects.toThrow(NetworkError);
    });

  });
});
