import { getCampaignConfig, CampaignConfigError } from "./campaignConfig";
import { boolean } from "io-ts";
import { Sentry } from "../../utils/errorTracking";

jest.mock("../../utils/errorTracking");
const mockCaptureException = jest.fn();
(Sentry.captureException as jest.Mock).mockImplementation(mockCaptureException);

const mockFetch = jest.fn();
jest.spyOn(global, "fetch").mockImplementation(mockFetch);

const mockValidResponse = {
  features: {
    minAppBinaryVersion: "3.0.0",
    minAppBuildVersion: 0,
    campaignName: "Test campaign",
    flowType: "DEFAULT",
    transactionGrouping: true
  }
};

const mockValidResponseNewFeature = {
  features: {
    minAppBinaryVersion: "3.0.0",
    minAppBuildVersion: 10,
    campaignName: "Test campaign",
    flowType: "DEFAULT",
    transactionGrouping: true,
    newFeature: true
  }
};

const mockValidResponseNoUpdates = {
  features: null
};

const mockInvalidResponseIncorrectType = {
  features: {
    minAppBuildVersion: "10"
  }
};

const mockInvalidResponseNewConfig = {
  features: {
    minAppBuildVersion: "10"
  },
  newConfig: {
    newProperty: boolean
  }
};

const key = "KEY";
const endpoint = "https://myendpoint.com";

describe("campaignConfig", () => {
  beforeEach(() => {
    mockFetch.mockReset();
    mockCaptureException.mockReset();
  });

  describe("getCampaignConfig", () => {
    it.each([mockValidResponse, mockValidResponseNewFeature])(
      "should return the campaign config when it's valid",
      async (response: any) => {
        expect.assertions(1);
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(response)
        });

        const config = await getCampaignConfig(key, endpoint, {});
        expect(config).toStrictEqual(response);
      }
    );

    it("should return null campaign configs when the current ones are the latest", async () => {
      expect.assertions(1);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockValidResponseNoUpdates)
      });

      const config = await getCampaignConfig(key, endpoint, {
        features: "latest-hash"
      });
      expect(config).toStrictEqual(mockValidResponseNoUpdates);
    });

    it.each([mockInvalidResponseIncorrectType, mockInvalidResponseNewConfig])(
      "should throw error if campaign config is malformed",
      async (response: any) => {
        expect.assertions(1);
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(response)
        });

        await expect(getCampaignConfig(key, endpoint, {})).rejects.toThrow(
          CampaignConfigError
        );
      }
    );

    it.each([mockInvalidResponseIncorrectType, mockInvalidResponseNewConfig])(
      "should capture exception through sentry if campaign config is malformed",
      async (response: any) => {
        expect.assertions(2);
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(response)
        });

        await expect(getCampaignConfig(key, endpoint, {})).rejects.toThrow(
          CampaignConfigError
        );
        expect(mockCaptureException).toHaveBeenCalledTimes(1);
      }
    );

    it("should throw error if campaign config could not be retrieved", async () => {
      expect.assertions(1);
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () =>
          Promise.resolve({ message: "Invalid authentication token provided" })
      });

      await expect(getCampaignConfig(key, endpoint, {})).rejects.toThrow(
        CampaignConfigError
      );
    });

    it("should throw error if there were issues fetching", async () => {
      expect.assertions(1);
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      await expect(getCampaignConfig(key, endpoint, {})).rejects.toThrow(
        "Network error"
      );
    });
  });
});
