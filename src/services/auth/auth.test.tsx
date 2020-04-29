import { requestOTP, LoginError, validateOTP } from "./index";
import * as Sentry from "sentry-expo";

jest.mock("sentry-expo");
const mockCaptureException = jest.fn();
(Sentry.captureException as jest.Mock).mockImplementation(mockCaptureException);

const anyGlobal: any = global;
const mockFetch = jest.fn();
anyGlobal.fetch = mockFetch;

const code = "ABC-123";
const phone = "+6591234567";
const otp = "123456";
const endpoint = "https://myendpoint.com";
const ttl = new Date(2030, 0, 1);
const sessionToken = "0000-11111-22222-33333-44444";

describe("auth", () => {
  beforeEach(() => {
    mockFetch.mockReset();
    mockCaptureException.mockReset();
  });

  describe("requestOTP", () => {
    it("should check the validity of the code", async () => {
      expect.assertions(1);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve()
      });
      await requestOTP(phone, code, endpoint);
      const payload = { code, phone };
      expect(mockFetch.mock.calls[0]).toEqual([
        `${endpoint}/auth/register`,
        {
          method: "POST",
          body: JSON.stringify(payload)
        }
      ]);
    });

    it("should throw error if OTP could not be retrieved", async () => {
      expect.assertions(1);
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () =>
          Promise.resolve({
            message: "Cannot register another phone number to this code"
          })
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
        json: () => Promise.resolve({ sessionToken, ttl: ttl.getTime() })
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
            ttl: ttl.getTime()
          })
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
            ttl: ttl.getTime()
          })
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
            message: "OTP does not match"
          })
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
});
