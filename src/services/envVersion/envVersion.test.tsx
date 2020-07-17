import { getEnvVersion, EnvVersionError } from ".";
import * as Sentry from "sentry-expo";

jest.mock("sentry-expo");
const mockCaptureException = jest.fn();
(Sentry.captureException as jest.Mock).mockImplementation(mockCaptureException);

const mockFetch = jest.fn();
jest.spyOn(global, "fetch").mockImplementation(mockFetch);

const mockGetEnvVersionValidResponse = {
  policies: [
    {
      category: "toilet-paper",
      name: "🧻 Toilet Paper",
      description: "1 ply / 2 ply / 3 ply",
      order: 1,
      quantity: {
        period: 7,
        limit: 2,
        unit: {
          type: "POSTFIX",
          label: " pack(s)"
        }
      }
    },
    {
      category: "chocolate",
      name: "🍫 Chocolate",
      description: "Dark / White / Assorted",
      order: 2,
      quantity: {
        period: 14,
        limit: 30,
        step: 5,
        unit: {
          type: "PREFIX",
          label: "$"
        }
      }
    }
  ],
  features: {
    REQUIRE_OTP: true,
    TRANSACTION_GROUPING: true,
    FLOW_TYPE: "DEFAULT"
  }
};

const mockGetEnvVersionInvalidResponse = {
  policies: [
    {
      category: "toilet-paper",
      name: "🧻 Toilet Paper",
      description: "1 ply / 2 ply / 3 ply",
      quantity: {
        period: 7,
        unit: {
          type: "POSTFIX",
          label: " pack(s)"
        }
      }
    },
    {
      category: "chocolate",
      name: "🍫 Chocolate",
      description: "Dark / White / Assorted",
      order: 2,
      quantity: {
        period: 14,
        limit: 30,
        step: 5,
        unit: {
          type: "PREFIX",
          label: "$"
        }
      }
    }
  ],
  features: {
    REQUIRE_OTP: true,
    TRANSACTION_GROUPING: true,
    FLOW_TYPE: "DEFAULT"
  }
};

const mockGetEnvVersionInvalidResponseWithoutFeatures = {
  policies: [
    {
      category: "toilet-paper",
      name: "🧻 Toilet Paper",
      description: "1 ply / 2 ply / 3 ply",
      order: 1,
      quantity: {
        period: 7,
        limit: 2,
        unit: {
          type: "POSTFIX",
          label: " pack(s)"
        }
      }
    },
    {
      category: "chocolate",
      name: "🍫 Chocolate",
      description: "Dark / White / Assorted",
      order: 2,
      quantity: {
        period: 14,
        limit: 30,
        step: 5,
        unit: {
          type: "PREFIX",
          label: "$"
        }
      }
    }
  ]
};

const key = "KEY";
const endpoint = "https://myendpoint.com";

describe("policies", () => {
  beforeEach(() => {
    mockFetch.mockReset();
    mockCaptureException.mockReset();
  });

  describe("getEnvVersion", () => {
    it("should return the policies when it's valid", async () => {
      expect.assertions(1);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockGetEnvVersionValidResponse)
      });

      const policies = await getEnvVersion(key, endpoint);
      expect(policies).toEqual(mockGetEnvVersionValidResponse);
    });

    it("should throw error if policy is malformed", async () => {
      expect.assertions(1);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockGetEnvVersionInvalidResponse)
      });

      await expect(getEnvVersion(key, endpoint)).rejects.toThrow(
        EnvVersionError
      );
    });

    it("should capture exception through sentry if policy is malformed", async () => {
      expect.assertions(2);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockGetEnvVersionInvalidResponse)
      });

      await expect(getEnvVersion(key, endpoint)).rejects.toThrow(
        EnvVersionError
      );
      expect(mockCaptureException).toHaveBeenCalledTimes(1);
    });

    it("should throw error if policy could not be retrieved", async () => {
      expect.assertions(1);
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () =>
          Promise.resolve({ message: "Invalid authentication token provided" })
      });

      await expect(getEnvVersion(key, endpoint)).rejects.toThrow(
        EnvVersionError
      );
    });

    it("should throw error if features could not be retrieved", async () => {
      expect.assertions(1);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve(mockGetEnvVersionInvalidResponseWithoutFeatures)
      });

      await expect(getEnvVersion(key, endpoint)).rejects.toThrow(
        EnvVersionError
      );
    });

    it("should throw error if there were issues fetching", async () => {
      expect.assertions(1);
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      await expect(getEnvVersion(key, endpoint)).rejects.toThrow(
        "Network error"
      );
    });
  });
});
