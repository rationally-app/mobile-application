import { renderHook } from "@testing-library/react-hooks";
import { useUpdateCampaignConfig } from "./useUpdateCampaignConfig";
import { getCampaignConfig } from "../../services/campaignConfig";
import { wait } from "@testing-library/react-native";

jest.mock("../../services/campaignConfig");
const mockGetCampaignConfig = getCampaignConfig as jest.Mock;

const operatorToken = "opToken";
const key = "KEY";
const endpoint = "https://myendpoint.com";

const addCampaignConfigSpy = jest.fn();

describe("useUpdateCampaignConfig", () => {
  beforeEach(() => {
    addCampaignConfigSpy.mockClear();
  });

  it("should set fetchingState and result when there are updates to the campaign config", async () => {
    expect.assertions(4);
    mockGetCampaignConfig.mockResolvedValue({
      features: {
        minAppBinaryVersion: "3.0.0",
        minAppBuildVersion: 0
      }
    });
    const { result } = renderHook(() =>
      useUpdateCampaignConfig(operatorToken, key, endpoint)
    );
    expect(result.current.fetchingState).toBe("DEFAULT");

    await wait(() => {
      result.current.updateCampaignConfig(undefined, addCampaignConfigSpy);
    });

    expect(addCampaignConfigSpy).toHaveBeenCalledTimes(1);
    expect(result.current.result).toStrictEqual({
      features: {
        minAppBinaryVersion: "3.0.0",
        minAppBuildVersion: 0
      }
    });
    expect(result.current.fetchingState).toBe("RETURNED_NEW_UPDATES");
  });

  it("should set fetchingState and not set result when there are no updates to the campaign config", async () => {
    expect.assertions(4);
    mockGetCampaignConfig.mockResolvedValue({
      features: null
    });
    const { result } = renderHook(() =>
      useUpdateCampaignConfig(operatorToken, key, endpoint)
    );
    expect(result.current.fetchingState).toBe("DEFAULT");

    await wait(() => {
      result.current.updateCampaignConfig(undefined, addCampaignConfigSpy);
    });

    expect(addCampaignConfigSpy).toHaveBeenCalledTimes(0);
    expect(result.current.result).toBeUndefined();
    expect(result.current.fetchingState).toBe("RETURNED_NO_UPDATES");
  });

  it("should set error when there's a problem getting the campaign config", async () => {
    expect.assertions(5);
    mockGetCampaignConfig.mockRejectedValue(
      new Error("Error getting campaign config")
    );
    const { result } = renderHook(() =>
      useUpdateCampaignConfig(operatorToken, key, endpoint)
    );
    expect(result.current.fetchingState).toBe("DEFAULT");

    await wait(() => {
      result.current.updateCampaignConfig(undefined, addCampaignConfigSpy);
    });

    expect(addCampaignConfigSpy).toHaveBeenCalledTimes(0);
    expect(result.current.fetchingState).toBe("FETCHING_CONFIG");
    expect(result.current.error?.message).toBe("Error getting campaign config");
    expect(result.current.result).toBeUndefined();
  });

  it("should set error when there's a problem saving the campaign config", async () => {
    expect.assertions(5);
    mockGetCampaignConfig.mockResolvedValue({
      features: {
        minAppBinaryVersion: "3.0.0",
        minAppBuildVersion: 0
      }
    });
    addCampaignConfigSpy.mockImplementation(() => {
      throw new Error("Error saving campaign config");
    });
    const { result } = renderHook(() =>
      useUpdateCampaignConfig(operatorToken, key, endpoint)
    );
    expect(result.current.fetchingState).toBe("DEFAULT");

    await wait(() => {
      result.current.updateCampaignConfig(undefined, addCampaignConfigSpy);
    });

    expect(addCampaignConfigSpy).toHaveBeenCalledTimes(1);
    expect(result.current.fetchingState).toBe("FETCHING_CONFIG");
    expect(result.current.error?.message).toBe("Error saving campaign config");
    expect(result.current.result).toBeUndefined();
  });

  it("should clear error when clearError is called", async () => {
    expect.assertions(2);
    mockGetCampaignConfig.mockResolvedValue({
      features: {
        minAppBinaryVersion: "3.0.0",
        minAppBuildVersion: 0
      }
    });
    addCampaignConfigSpy.mockImplementation(() => {
      throw new Error("Error saving campaign config");
    });
    const { result } = renderHook(() =>
      useUpdateCampaignConfig(operatorToken, key, endpoint)
    );

    await wait(() =>
      result.current.updateCampaignConfig(undefined, addCampaignConfigSpy)
    );
    expect(result.current.error?.message).toBe("Error saving campaign config");

    await wait(() => result.current.clearError());
    expect(result.current.error).toBeUndefined();
  });

  it("should clear the previous error when calling updateCampaignConfig again", async () => {
    expect.assertions(2);
    mockGetCampaignConfig.mockResolvedValue({
      features: {
        minAppBinaryVersion: "3.0.0",
        minAppBuildVersion: 0
      }
    });
    addCampaignConfigSpy.mockImplementation(() => {
      throw new Error("Error saving campaign config");
    });
    const { result } = renderHook(() =>
      useUpdateCampaignConfig(operatorToken, key, endpoint)
    );

    await wait(() =>
      result.current.updateCampaignConfig(undefined, addCampaignConfigSpy)
    );
    expect(result.current.error?.message).toBe("Error saving campaign config");

    await wait(() => {
      result.current.updateCampaignConfig(undefined, addCampaignConfigSpy);
      expect(result.current.error).toBeUndefined();
    });
  });

  it("should clear the previous result when calling updateCampaignConfig again", async () => {
    expect.assertions(3);
    mockGetCampaignConfig.mockResolvedValue({
      features: {
        minAppBinaryVersion: "3.0.0",
        minAppBuildVersion: 0
      }
    });
    addCampaignConfigSpy.mockReset();
    const { result } = renderHook(() =>
      useUpdateCampaignConfig(operatorToken, key, endpoint)
    );

    await wait(() =>
      result.current.updateCampaignConfig(undefined, addCampaignConfigSpy)
    );
    expect(result.current.fetchingState).toBe("RETURNED_NEW_UPDATES");
    expect(result.current.result).not.toBeUndefined();

    await wait(() => {
      result.current.updateCampaignConfig(undefined, addCampaignConfigSpy);
      expect(result.current.result).toBeUndefined();
    });
  });
});
