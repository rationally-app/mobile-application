import React, { FunctionComponent } from "react";
import { renderHook } from "@testing-library/react-hooks";
import { CampaignConfigContext } from "../../context/campaignConfig";
import { ConfigHashes } from "../../types";
import { useUpdateCampaignConfig } from "./useUpdateCampaignConfig";
import { getCampaignConfig } from "../../services/campaignConfig";
import { wait } from "@testing-library/react-native";

jest.mock("../../services/campaignConfig");
const mockGetCampaignConfig = getCampaignConfig as jest.Mock;

const key = "KEY";
const endpoint = "https://myendpoint.com";

const setCampaignConfigSpy = jest.fn();
const wrapper = (configHashes: ConfigHashes): FunctionComponent => ({
  children
}) => (
  <CampaignConfigContext.Provider
    value={{
      features: null,
      setCampaignConfig: setCampaignConfigSpy,
      clearCampaignConfig: () => null,
      configHashes
    }}
  >
    {children}
  </CampaignConfigContext.Provider>
);

describe("useUpdateCampaignConfig", () => {
  beforeEach(() => {
    setCampaignConfigSpy.mockClear();
  });

  it("should set fetchingState and result when there are updates to the campaign config", async () => {
    expect.assertions(5);
    mockGetCampaignConfig.mockResolvedValue({
      features: {
        minAppBinaryVersion: "3.0.0",
        minAppBuildVersion: 0
      }
    });
    const { result } = renderHook(
      () => useUpdateCampaignConfig(key, endpoint),
      {
        wrapper: wrapper({})
      }
    );
    expect(result.current.fetchingState).toBe("DEFAULT");

    await wait(() => {
      result.current.updateCampaignConfig();
      expect(result.current.fetchingState).toBe("FETCHING_CONFIG");
    });
    expect(setCampaignConfigSpy).toHaveBeenCalledTimes(1);
    expect(result.current.fetchingState).toBe("RESULT_RETURNED_NEW_UPDATES");
    expect(result.current.result).toStrictEqual({
      features: {
        minAppBinaryVersion: "3.0.0",
        minAppBuildVersion: 0
      }
    });
  });

  it("should set fetchingState and not set result when there are no updates to the campaign config", async () => {
    expect.assertions(5);
    mockGetCampaignConfig.mockResolvedValue({
      features: null
    });
    const { result } = renderHook(
      () => useUpdateCampaignConfig(key, endpoint),
      {
        wrapper: wrapper({})
      }
    );
    expect(result.current.fetchingState).toBe("DEFAULT");

    await wait(() => {
      result.current.updateCampaignConfig();
      expect(result.current.fetchingState).toBe("FETCHING_CONFIG");
    });
    expect(setCampaignConfigSpy).toHaveBeenCalledTimes(0);
    expect(result.current.fetchingState).toBe("RESULT_RETURNED_NO_UPDATES");
    expect(result.current.result).toBeUndefined();
  });

  it("should set error when there's a problem getting the campaign config", async () => {
    expect.assertions(6);
    mockGetCampaignConfig.mockRejectedValue(
      new Error("Error getting campaign config")
    );
    const { result } = renderHook(
      () => useUpdateCampaignConfig(key, endpoint),
      {
        wrapper: wrapper({})
      }
    );
    expect(result.current.fetchingState).toBe("DEFAULT");

    await wait(() => {
      result.current.updateCampaignConfig();
      expect(result.current.fetchingState).toBe("FETCHING_CONFIG");
    });
    expect(setCampaignConfigSpy).toHaveBeenCalledTimes(0);
    expect(result.current.fetchingState).toBe("FETCHING_CONFIG");
    expect(result.current.error?.message).toBe("Error getting campaign config");
    expect(result.current.result).toBeUndefined();
  });

  it("should set error when there's a problem saving the campaign config", async () => {
    expect.assertions(6);
    mockGetCampaignConfig.mockResolvedValue({
      features: {
        minAppBinaryVersion: "3.0.0",
        minAppBuildVersion: 0
      }
    });
    setCampaignConfigSpy.mockRejectedValue(
      new Error("Error saving campaign config")
    );
    const { result } = renderHook(
      () => useUpdateCampaignConfig(key, endpoint),
      {
        wrapper: wrapper({})
      }
    );
    expect(result.current.fetchingState).toBe("DEFAULT");

    await wait(() => {
      result.current.updateCampaignConfig();
      expect(result.current.fetchingState).toBe("FETCHING_CONFIG");
    });
    expect(setCampaignConfigSpy).toHaveBeenCalledTimes(1);
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
    setCampaignConfigSpy.mockRejectedValue(
      new Error("Error saving campaign config")
    );
    const { result } = renderHook(
      () => useUpdateCampaignConfig(key, endpoint),
      {
        wrapper: wrapper({})
      }
    );

    await wait(() => result.current.updateCampaignConfig());
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
    setCampaignConfigSpy.mockRejectedValue(
      new Error("Error saving campaign config")
    );
    const { result } = renderHook(
      () => useUpdateCampaignConfig(key, endpoint),
      {
        wrapper: wrapper({})
      }
    );

    await wait(() => result.current.updateCampaignConfig());
    expect(result.current.error?.message).toBe("Error saving campaign config");

    await wait(() => {
      result.current.updateCampaignConfig();
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
    setCampaignConfigSpy.mockReset();
    const { result } = renderHook(
      () => useUpdateCampaignConfig(key, endpoint),
      {
        wrapper: wrapper({})
      }
    );

    await wait(() => result.current.updateCampaignConfig());
    expect(result.current.fetchingState).toBe("RESULT_RETURNED_NEW_UPDATES");
    expect(result.current.result).not.toBeUndefined();

    await wait(() => {
      result.current.updateCampaignConfig();
      expect(result.current.result).toBeUndefined();
    });
  });
});
