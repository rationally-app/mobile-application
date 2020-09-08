import React from "react";
import {
  CampaignConfigsStoreContextProvider,
  CampaignConfigsStoreContext
} from "./campaignConfigsStore";
import { render, wait, fireEvent } from "@testing-library/react-native";
import { Text, Button } from "react-native";
import { Sentry } from "../utils/errorTracking";
import { ErrorBoundary } from "../components/ErrorBoundary/ErrorBoundary";

const mockGetItem = jest.fn();
const mockSetItem = jest.fn();
jest.mock("react-native/Libraries/Storage/AsyncStorage", () => ({
  getItem: mockGetItem,
  setItem: mockSetItem
}));

jest.mock("../utils/errorTracking");
const mockCaptureException = jest.fn();
(Sentry.captureException as jest.Mock).mockImplementation(mockCaptureException);

const testCampaignKey = "test-campaign";

describe("CampaignConfigsStoreContextProvider", () => {
  beforeEach(() => {
    mockGetItem.mockReset();
    mockSetItem.mockReset();
    mockCaptureException.mockReset();
  });

  it("should load the campaign configs from the store if it exists", async () => {
    expect.assertions(6);
    mockGetItem.mockImplementationOnce(() =>
      JSON.stringify({
        [testCampaignKey]: {
          features: { asd: "asd" },
          policies: [{ sdf: "sdf" }]
        }
      })
    );

    const { queryByTestId } = render(
      <CampaignConfigsStoreContextProvider>
        <CampaignConfigsStoreContext.Consumer>
          {({ hasLoadedFromStore, allCampaignConfigs }) => (
            <>
              {hasLoadedFromStore && (
                <Text testID="loaded">{hasLoadedFromStore}</Text>
              )}
              <Text testID="features">
                {JSON.stringify(allCampaignConfigs[testCampaignKey]?.features)}
              </Text>
              <Text testID="policies">
                {JSON.stringify(allCampaignConfigs[testCampaignKey]?.policies)}
              </Text>
            </>
          )}
        </CampaignConfigsStoreContext.Consumer>
      </CampaignConfigsStoreContextProvider>
    );

    expect(mockGetItem).toHaveBeenCalledTimes(1);
    expect(mockGetItem).toHaveBeenCalledWith("CAMPAIGN_CONFIGS_STORE");
    expect(queryByTestId("loaded")).toBeNull();

    await wait(() => {
      expect(queryByTestId("features")).toHaveTextContent(`{"asd":"asd"}`);
      expect(queryByTestId("policies")).toHaveTextContent(`[{"sdf":"sdf"}]`);
      expect(queryByTestId("loaded")).toHaveTextContent("true");
    });
  });

  it("should not set configs if it doesn't exist in the store", async () => {
    expect.assertions(4);

    const { queryByTestId } = render(
      <CampaignConfigsStoreContextProvider>
        <CampaignConfigsStoreContext.Consumer>
          {({ allCampaignConfigs }) => (
            <>
              <Text testID="features">
                {JSON.stringify(allCampaignConfigs[testCampaignKey]?.features)}
              </Text>
              <Text testID="policies">
                {JSON.stringify(allCampaignConfigs[testCampaignKey]?.policies)}
              </Text>
            </>
          )}
        </CampaignConfigsStoreContext.Consumer>
      </CampaignConfigsStoreContextProvider>
    );

    expect(mockGetItem).toHaveBeenCalledTimes(1);
    expect(mockGetItem).toHaveBeenCalledWith("CAMPAIGN_CONFIGS_STORE");

    await wait(() => {
      expect(queryByTestId("features")).toHaveTextContent("");
      expect(queryByTestId("policies")).toHaveTextContent("");
    });
  });

  it("should call Sentry when the campaign config from the store is malformed", async () => {
    expect.assertions(3);
    mockGetItem.mockImplementationOnce(() => "malformed object");

    render(
      <ErrorBoundary>
        <CampaignConfigsStoreContextProvider>
          <CampaignConfigsStoreContext.Consumer>
            {({ allCampaignConfigs }) => (
              <Text testID="features">
                {JSON.stringify(allCampaignConfigs[testCampaignKey]?.features)}
              </Text>
            )}
          </CampaignConfigsStoreContext.Consumer>
        </CampaignConfigsStoreContextProvider>
      </ErrorBoundary>
    );

    expect(mockGetItem).toHaveBeenCalledTimes(1);
    expect(mockGetItem).toHaveBeenCalledWith("CAMPAIGN_CONFIGS_STORE");

    await wait(() => {
      expect(mockCaptureException).toHaveBeenCalledTimes(1);
    });
  });

  it("should clear the campaign configs and from asyncstorage when clear function is called", async () => {
    expect.assertions(8);
    mockGetItem.mockImplementationOnce(() =>
      JSON.stringify({
        [testCampaignKey]: {
          features: { asd: "asd" },
          policies: [{ sdf: "sdf" }]
        }
      })
    );

    const { queryByTestId, getByText } = render(
      <CampaignConfigsStoreContextProvider>
        <CampaignConfigsStoreContext.Consumer>
          {({ allCampaignConfigs, clearCampaignConfigs }) => (
            <>
              <Text testID="features">
                {JSON.stringify(allCampaignConfigs[testCampaignKey]?.features)}
              </Text>
              <Text testID="policies">
                {JSON.stringify(allCampaignConfigs[testCampaignKey]?.policies)}
              </Text>
              <Button
                onPress={() => clearCampaignConfigs()}
                title="test button"
              />
            </>
          )}
        </CampaignConfigsStoreContext.Consumer>
      </CampaignConfigsStoreContextProvider>
    );

    expect(mockGetItem).toHaveBeenCalledTimes(1);
    expect(mockGetItem).toHaveBeenCalledWith("CAMPAIGN_CONFIGS_STORE");

    await wait(() => {
      expect(queryByTestId("features")).toHaveTextContent(`{"asd":"asd"}`);
      expect(queryByTestId("policies")).toHaveTextContent(`[{"sdf":"sdf"}]`);
    });

    const button = getByText("test button");
    fireEvent.press(button);
    await wait(() => {
      expect(mockSetItem).toHaveBeenCalledTimes(1);
      expect(mockSetItem).toHaveBeenCalledWith("CAMPAIGN_CONFIGS_STORE", "{}");
      expect(queryByTestId("features")).toHaveTextContent("");
      expect(queryByTestId("policies")).toHaveTextContent("");
    });
  });

  it("should add a campaign config properly", async () => {
    expect.assertions(8);
    mockGetItem.mockImplementationOnce(() =>
      JSON.stringify({
        [testCampaignKey]: {
          features: { asd: "asd" },
          policies: [{ sdf: "sdf" }]
        }
      })
    );

    const { queryByTestId, getByText } = render(
      <CampaignConfigsStoreContextProvider>
        <CampaignConfigsStoreContext.Consumer>
          {({ allCampaignConfigs, setCampaignConfig }) => (
            <>
              <Text testID="features">
                {JSON.stringify(allCampaignConfigs[testCampaignKey]?.features)}
              </Text>
              <Text testID="policies">
                {JSON.stringify(allCampaignConfigs[testCampaignKey]?.policies)}
              </Text>
              <Button
                onPress={() =>
                  setCampaignConfig(testCampaignKey, {
                    features: { new: "new" },
                    policies: [{ new: "new" }]
                  } as any)
                }
                title="test button"
              />
            </>
          )}
        </CampaignConfigsStoreContext.Consumer>
      </CampaignConfigsStoreContextProvider>
    );

    expect(mockGetItem).toHaveBeenCalledTimes(1);
    expect(mockGetItem).toHaveBeenCalledWith("CAMPAIGN_CONFIGS_STORE");

    await wait(() => {
      expect(queryByTestId("features")).toHaveTextContent(`{"asd":"asd"}`);
      expect(queryByTestId("policies")).toHaveTextContent(`[{"sdf":"sdf"}]`);
    });

    const button = getByText("test button");
    fireEvent.press(button);
    await wait(() => {
      expect(mockSetItem).toHaveBeenCalledTimes(1);
      expect(mockSetItem).toHaveBeenCalledWith(
        "CAMPAIGN_CONFIGS_STORE",
        JSON.stringify({
          [testCampaignKey]: {
            features: { new: "new" },
            policies: [{ new: "new" }]
          }
        })
      );
      expect(queryByTestId("features")).toHaveTextContent(`{"new":"new"}`);
      expect(queryByTestId("policies")).toHaveTextContent(`[{"new":"new"}]`);
    });
  });

  it("should add a campaign config properly when there are existing configs for other campaigns", async () => {
    expect.assertions(6);
    mockGetItem.mockImplementationOnce(() =>
      JSON.stringify({
        [testCampaignKey]: {
          features: { asd: "asd" },
          policies: [{ sdf: "sdf" }]
        },
        "another-test-campaign": {
          features: { dfg: "dfg" },
          policies: [{ sdf: "sdf" }]
        }
      })
    );

    const { queryByTestId, getByText } = render(
      <CampaignConfigsStoreContextProvider>
        <CampaignConfigsStoreContext.Consumer>
          {({ allCampaignConfigs, setCampaignConfig }) => (
            <>
              <Text testID="configs">{JSON.stringify(allCampaignConfigs)}</Text>
              <Button
                onPress={() =>
                  setCampaignConfig(testCampaignKey, {
                    features: { new: "new" },
                    policies: [{ new: "new" }]
                  } as any)
                }
                title="test button"
              />
            </>
          )}
        </CampaignConfigsStoreContext.Consumer>
      </CampaignConfigsStoreContextProvider>
    );

    expect(mockGetItem).toHaveBeenCalledTimes(1);
    expect(mockGetItem).toHaveBeenCalledWith("CAMPAIGN_CONFIGS_STORE");

    await wait(() => {
      expect(queryByTestId("configs")).toHaveTextContent(
        `{"test-campaign":{"features":{"asd":"asd"},"policies":[{"sdf":"sdf"}]},"another-test-campaign":{"features":{"dfg":"dfg"},"policies":[{"sdf":"sdf"}]}}`
      );
    });

    const button = getByText("test button");
    fireEvent.press(button);
    await wait(() => {
      expect(mockSetItem).toHaveBeenCalledTimes(1);
      expect(mockSetItem).toHaveBeenCalledWith(
        "CAMPAIGN_CONFIGS_STORE",
        JSON.stringify({
          [testCampaignKey]: {
            features: { new: "new" },
            policies: [{ new: "new" }]
          },
          "another-test-campaign": {
            features: { dfg: "dfg" },
            policies: [{ sdf: "sdf" }]
          }
        })
      );
      expect(queryByTestId("configs")).toHaveTextContent(
        `{"test-campaign":{"features":{"new":"new"},"policies":[{"new":"new"}]},"another-test-campaign":{"features":{"dfg":"dfg"},"policies":[{"sdf":"sdf"}]}}`
      );
    });
  });

  it("should add the campaign config properly when some null keys are input", async () => {
    expect.assertions(8);
    mockGetItem.mockImplementationOnce(() =>
      JSON.stringify({
        [testCampaignKey]: {
          features: { asd: "asd" },
          policies: [{ sdf: "sdf" }]
        }
      })
    );

    const { queryByTestId, getByText } = render(
      <CampaignConfigsStoreContextProvider>
        <CampaignConfigsStoreContext.Consumer>
          {({ allCampaignConfigs, setCampaignConfig }) => (
            <>
              <Text testID="features">
                {JSON.stringify(allCampaignConfigs[testCampaignKey]?.features)}
              </Text>
              <Text testID="policies">
                {JSON.stringify(allCampaignConfigs[testCampaignKey]?.policies)}
              </Text>
              <Button
                onPress={() =>
                  setCampaignConfig(testCampaignKey, {
                    features: null,
                    policies: [{ new: "new" }]
                  } as any)
                }
                title="test button"
              />
            </>
          )}
        </CampaignConfigsStoreContext.Consumer>
      </CampaignConfigsStoreContextProvider>
    );

    expect(mockGetItem).toHaveBeenCalledTimes(1);
    expect(mockGetItem).toHaveBeenCalledWith("CAMPAIGN_CONFIGS_STORE");

    await wait(() => {
      expect(queryByTestId("features")).toHaveTextContent(`{"asd":"asd"}`);
      expect(queryByTestId("policies")).toHaveTextContent(`[{"sdf":"sdf"}]`);
    });

    const button = getByText("test button");
    fireEvent.press(button);
    await wait(() => {
      expect(mockSetItem).toHaveBeenCalledTimes(1);
      expect(mockSetItem).toHaveBeenCalledWith(
        "CAMPAIGN_CONFIGS_STORE",
        JSON.stringify({
          [testCampaignKey]: {
            features: { asd: "asd" },
            policies: [{ new: "new" }]
          }
        })
      );
      expect(queryByTestId("features")).toHaveTextContent(`{"asd":"asd"}`);
      expect(queryByTestId("policies")).toHaveTextContent(`[{"new":"new"}]`);
    });
  });

  it("should remove a campaign config properly", async () => {
    expect.assertions(8);
    mockGetItem.mockImplementationOnce(() =>
      JSON.stringify({
        [testCampaignKey]: {
          features: { asd: "asd" },
          policies: [{ sdf: "sdf" }]
        }
      })
    );

    const { queryByTestId, getByText } = render(
      <CampaignConfigsStoreContextProvider>
        <CampaignConfigsStoreContext.Consumer>
          {({ allCampaignConfigs, removeCampaignConfig }) => (
            <>
              <Text testID="features">
                {JSON.stringify(allCampaignConfigs[testCampaignKey]?.features)}
              </Text>
              <Text testID="policies">
                {JSON.stringify(allCampaignConfigs[testCampaignKey]?.policies)}
              </Text>
              <Button
                onPress={() => removeCampaignConfig(testCampaignKey)}
                title="test button"
              />
            </>
          )}
        </CampaignConfigsStoreContext.Consumer>
      </CampaignConfigsStoreContextProvider>
    );

    expect(mockGetItem).toHaveBeenCalledTimes(1);
    expect(mockGetItem).toHaveBeenCalledWith("CAMPAIGN_CONFIGS_STORE");

    await wait(() => {
      expect(queryByTestId("features")).toHaveTextContent(`{"asd":"asd"}`);
      expect(queryByTestId("policies")).toHaveTextContent(`[{"sdf":"sdf"}]`);
    });

    const button = getByText("test button");
    fireEvent.press(button);
    await wait(() => {
      expect(mockSetItem).toHaveBeenCalledTimes(1);
      expect(mockSetItem).toHaveBeenCalledWith("CAMPAIGN_CONFIGS_STORE", "{}");
      expect(queryByTestId("features")).toHaveTextContent("");
      expect(queryByTestId("policies")).toHaveTextContent("");
    });
  });
});
