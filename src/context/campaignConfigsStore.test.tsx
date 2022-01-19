import React from "react";
import {
  CampaignConfigsStoreContextProvider,
  CampaignConfigsStoreContext,
} from "./campaignConfigsStore";
import { render, waitFor, fireEvent } from "@testing-library/react-native";
import { Text, Button } from "react-native";
import { Sentry } from "../utils/errorTracking";
import { ErrorBoundary } from "../components/ErrorBoundary/ErrorBoundary";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  readFromStoreInBuckets,
  saveToStoreInBuckets,
} from "../utils/bucketStorageHelper";
import { act } from "react-test-renderer";

jest.mock("../utils/bucketStorageHelper");

const mockGetItem = AsyncStorage.getItem as jest.MockedFunction<
  typeof AsyncStorage.getItem
>;
const mockSetItem = AsyncStorage.setItem as jest.MockedFunction<
  typeof AsyncStorage.setItem
>;
const mockRemoveItem = AsyncStorage.removeItem as jest.MockedFunction<
  typeof AsyncStorage.removeItem
>;

const mockReadBucket = readFromStoreInBuckets as jest.MockedFunction<
  typeof readFromStoreInBuckets
>;
const mockWriteBucket = saveToStoreInBuckets as jest.MockedFunction<
  typeof saveToStoreInBuckets
>;

jest.mock("../utils/errorTracking");
const mockCaptureException = jest.fn();
(Sentry.captureException as jest.Mock).mockImplementation(mockCaptureException);

const testCampaignKey = "test-campaign";

describe("CampaignConfigsStoreContextProvider", () => {
  beforeEach(() => {
    mockGetItem.mockReset().mockName("asyncGetItem");
    mockSetItem.mockReset().mockName("asyncSetItem");
    mockRemoveItem.mockReset().mockName("asyncRemoveItem");
    mockReadBucket.mockReset().mockName("bucketReadItem");
    mockWriteBucket
      .mockReset()
      .mockName("bucketWriteItem")
      .mockResolvedValue(undefined);
    mockCaptureException.mockReset();
  });

  it("should load the campaign configs from the store if it exists", async () => {
    expect.assertions(7);
    mockReadBucket.mockResolvedValueOnce(
      JSON.stringify({
        [testCampaignKey]: {
          features: { validFeature: "validFeature" },
          policies: [{ validPolicy: "validPolicy" }],
          c13n: { validTranslation: "validTranslation" },
        },
      })
    );

    const { queryByTestId } = render(
      <CampaignConfigsStoreContextProvider>
        <CampaignConfigsStoreContext.Consumer>
          {({ hasLoadedFromStore, allCampaignConfigs }) => (
            <>
              {hasLoadedFromStore && (
                <Text testID="loaded">{`${hasLoadedFromStore}`}</Text>
              )}
              <Text testID="features">
                {JSON.stringify(allCampaignConfigs[testCampaignKey]?.features)}
              </Text>
              <Text testID="policies">
                {JSON.stringify(allCampaignConfigs[testCampaignKey]?.policies)}
              </Text>
              <Text testID="c13n">
                {JSON.stringify(allCampaignConfigs[testCampaignKey]?.c13n)}
              </Text>
            </>
          )}
        </CampaignConfigsStoreContext.Consumer>
      </CampaignConfigsStoreContextProvider>
    );

    expect(mockReadBucket).toHaveBeenCalledTimes(1);
    expect(mockReadBucket).toHaveBeenCalledWith("CAMPAIGN_CONFIGS_STORE");
    expect(queryByTestId("loaded")).toBeNull();
    await waitFor(() => {
      expect(queryByTestId("features")).toHaveTextContent(
        `{"validFeature":"validFeature"}`
      );
      expect(queryByTestId("policies")).toHaveTextContent(
        `[{"validPolicy":"validPolicy"}]`
      );
      expect(queryByTestId("c13n")).toHaveTextContent(
        `{"validTranslation":"validTranslation"}`
      );
      expect(queryByTestId("loaded")).toHaveTextContent("true");
    });
  });

  it("should not set configs if it doesn't exist in the store", async () => {
    expect.assertions(5);

    mockReadBucket.mockResolvedValueOnce("{}");

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
              <Text testID="c13n">
                {JSON.stringify(allCampaignConfigs[testCampaignKey]?.c13n)}
              </Text>
            </>
          )}
        </CampaignConfigsStoreContext.Consumer>
      </CampaignConfigsStoreContextProvider>
    );

    expect(mockReadBucket).toHaveBeenCalledTimes(1);
    expect(mockReadBucket).toHaveBeenCalledWith("CAMPAIGN_CONFIGS_STORE");

    await waitFor(() => {
      expect(queryByTestId("features")).toHaveTextContent("");
      expect(queryByTestId("policies")).toHaveTextContent("");
      expect(queryByTestId("c13n")).toHaveTextContent("");
    });
  });

  it("should call Sentry when the campaign config from the store is malformed", async () => {
    expect.assertions(3);
    jest.setTimeout(60000);
    mockReadBucket.mockResolvedValueOnce("malformed object");

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

    expect(mockReadBucket).toHaveBeenCalledTimes(1);
    expect(mockReadBucket).toHaveBeenCalledWith("CAMPAIGN_CONFIGS_STORE");

    await waitFor(() => {
      expect(mockCaptureException).toHaveBeenCalledTimes(1);
    });
  });

  it("should clear the campaign configs and from asyncstorage when clear function is called", async () => {
    expect.assertions(10);
    mockReadBucket.mockResolvedValueOnce(
      JSON.stringify({
        [testCampaignKey]: {
          features: { validFeature: "validFeature" },
          policies: [{ validPolicy: "validPolicy" }],
          c13n: { validTranslation: "validTranslation" },
        },
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
              <Text testID="c13n">
                {JSON.stringify(allCampaignConfigs[testCampaignKey]?.c13n)}
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

    expect(mockReadBucket).toHaveBeenCalledTimes(1);
    expect(mockReadBucket).toHaveBeenCalledWith("CAMPAIGN_CONFIGS_STORE");

    await waitFor(() => {
      expect(queryByTestId("features")).toHaveTextContent(
        `{"validFeature":"validFeature"}`
      );
      expect(queryByTestId("policies")).toHaveTextContent(
        `[{"validPolicy":"validPolicy"}]`
      );
      expect(queryByTestId("c13n")).toHaveTextContent(
        `{"validTranslation":"validTranslation"}`
      );
    });

    await act(async () => {
      const button = getByText("test button");
      fireEvent.press(button);
    });

    expect(mockWriteBucket).toHaveBeenCalledTimes(1);
    expect(mockWriteBucket).toHaveBeenCalledWith(
      "CAMPAIGN_CONFIGS_STORE",
      "{}",
      JSON.stringify({
        [testCampaignKey]: {
          features: { validFeature: "validFeature" },
          policies: [{ validPolicy: "validPolicy" }],
          c13n: { validTranslation: "validTranslation" },
        },
      })
    );
    expect(queryByTestId("features")).toHaveTextContent("");
    expect(queryByTestId("policies")).toHaveTextContent("");
    expect(queryByTestId("c13n")).toHaveTextContent("");
  });

  it("should add a campaign config properly", async () => {
    expect.assertions(10);
    mockReadBucket.mockResolvedValueOnce(
      JSON.stringify({
        [testCampaignKey]: {
          features: { validFeature: "validFeature" },
          policies: [{ validPolicy: "validPolicy" }],
          c13n: { validTranslation: "validTranslation" },
        },
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
              <Text testID="c13n">
                {JSON.stringify(allCampaignConfigs[testCampaignKey]?.c13n)}
              </Text>
              <Button
                onPress={() =>
                  setCampaignConfig(testCampaignKey, {
                    features: { newFeature: "newFeature" },
                    policies: [{ newPolicy: "newPolicy" }],
                    c13n: { newTranslation: "newTranslation" },
                  } as any)
                }
                title="test button"
              />
            </>
          )}
        </CampaignConfigsStoreContext.Consumer>
      </CampaignConfigsStoreContextProvider>
    );

    expect(mockReadBucket).toHaveBeenCalledTimes(1);
    expect(mockReadBucket).toHaveBeenCalledWith("CAMPAIGN_CONFIGS_STORE");

    await waitFor(() => {
      expect(queryByTestId("features")).toHaveTextContent(
        `{"validFeature":"validFeature"}`
      );
      expect(queryByTestId("policies")).toHaveTextContent(
        `[{"validPolicy":"validPolicy"}]`
      );
      expect(queryByTestId("c13n")).toHaveTextContent(
        `{"validTranslation":"validTranslation"}`
      );
    });

    await act(async () => {
      const button = getByText("test button");
      fireEvent.press(button);
    });

    expect(mockWriteBucket).toHaveBeenCalledTimes(1);
    expect(mockWriteBucket).toHaveBeenCalledWith(
      "CAMPAIGN_CONFIGS_STORE",
      JSON.stringify({
        [testCampaignKey]: {
          features: { newFeature: "newFeature" },
          policies: [{ newPolicy: "newPolicy" }],
          c13n: { newTranslation: "newTranslation" },
        },
      }),
      JSON.stringify({
        [testCampaignKey]: {
          features: { validFeature: "validFeature" },
          policies: [{ validPolicy: "validPolicy" }],
          c13n: { validTranslation: "validTranslation" },
        },
      })
    );
    expect(queryByTestId("features")).toHaveTextContent(
      `{"newFeature":"newFeature"}`
    );
    expect(queryByTestId("policies")).toHaveTextContent(
      `[{"newPolicy":"newPolicy"}]`
    );
    expect(queryByTestId("c13n")).toHaveTextContent(
      `{"newTranslation":"newTranslation"}`
    );
  });

  it("should add a campaign config properly when there are existing configs for other campaigns", async () => {
    expect.assertions(6);
    mockReadBucket.mockResolvedValueOnce(
      JSON.stringify({
        [testCampaignKey]: {
          features: { validFeature: "validFeature" },
          policies: [{ validPolicy: "validPolicy" }],
          c13n: { validTranslation: "validTranslation" },
        },
        "another-test-campaign": {
          features: { validFeature: "anotherFeature" },
          policies: [{ validPolicy: "anotherPolicy" }],
          c13n: { validTranslation: "anotherTranslation" },
        },
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
                    features: { newFeature: "newFeature" },
                    policies: [{ newPolicy: "newPolicy" }],
                    c13n: { newTranslation: "newTranslation" },
                  } as any)
                }
                title="test button"
              />
            </>
          )}
        </CampaignConfigsStoreContext.Consumer>
      </CampaignConfigsStoreContextProvider>
    );

    expect(mockReadBucket).toHaveBeenCalledTimes(1);
    expect(mockReadBucket).toHaveBeenCalledWith("CAMPAIGN_CONFIGS_STORE");

    await waitFor(() => {
      expect(queryByTestId("configs")).toHaveTextContent(
        `{"test-campaign":{"features":{"validFeature":"validFeature"},"policies":[{"validPolicy":"validPolicy"}],"c13n":{"validTranslation":"validTranslation"}},"another-test-campaign":{"features":{"validFeature":"anotherFeature"},"policies":[{"validPolicy":"anotherPolicy"}],"c13n":{"validTranslation":"anotherTranslation"}}}`
      );
    });

    await act(async () => {
      const button = getByText("test button");
      fireEvent.press(button);
    });

    expect(mockWriteBucket).toHaveBeenCalledTimes(1);
    expect(mockWriteBucket).toHaveBeenCalledWith(
      "CAMPAIGN_CONFIGS_STORE",
      JSON.stringify({
        [testCampaignKey]: {
          features: { newFeature: "newFeature" },
          policies: [{ newPolicy: "newPolicy" }],
          c13n: { newTranslation: "newTranslation" },
        },
        "another-test-campaign": {
          features: { validFeature: "anotherFeature" },
          policies: [{ validPolicy: "anotherPolicy" }],
          c13n: { validTranslation: "anotherTranslation" },
        },
      }),
      JSON.stringify({
        [testCampaignKey]: {
          features: { validFeature: "validFeature" },
          policies: [{ validPolicy: "validPolicy" }],
          c13n: { validTranslation: "validTranslation" },
        },
        "another-test-campaign": {
          features: { validFeature: "anotherFeature" },
          policies: [{ validPolicy: "anotherPolicy" }],
          c13n: { validTranslation: "anotherTranslation" },
        },
      })
    );
    expect(queryByTestId("configs")).toHaveTextContent(
      `{"test-campaign":{"features":{"newFeature":"newFeature"},"policies":[{"newPolicy":"newPolicy"}],"c13n":{"newTranslation":"newTranslation"}},"another-test-campaign":{"features":{"validFeature":"anotherFeature"},"policies":[{"validPolicy":"anotherPolicy"}],"c13n":{"validTranslation":"anotherTranslation"}}}`
    );
  });

  it("should add the campaign config properly when some null keys are input", async () => {
    expect.assertions(10);
    mockReadBucket.mockResolvedValueOnce(
      JSON.stringify({
        [testCampaignKey]: {
          features: { validFeature: "validFeature" },
          policies: [{ validPolicy: "validPolicy" }],
          c13n: { validTranslation: "validTranslation" },
        },
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
              <Text testID="c13n">
                {JSON.stringify(allCampaignConfigs[testCampaignKey]?.c13n)}
              </Text>
              <Button
                onPress={() =>
                  setCampaignConfig(testCampaignKey, {
                    features: null,
                    policies: [{ newPolicy: "newPolicy" }],
                    c13n: { validTranslation: "validTranslation" },
                  } as any)
                }
                title="test button"
              />
            </>
          )}
        </CampaignConfigsStoreContext.Consumer>
      </CampaignConfigsStoreContextProvider>
    );

    expect(mockReadBucket).toHaveBeenCalledTimes(1);
    expect(mockReadBucket).toHaveBeenCalledWith("CAMPAIGN_CONFIGS_STORE");

    await waitFor(() => {
      expect(queryByTestId("features")).toHaveTextContent(
        `{"validFeature":"validFeature"}`
      );
      expect(queryByTestId("policies")).toHaveTextContent(
        `[{"validPolicy":"validPolicy"}]`
      );
      expect(queryByTestId("c13n")).toHaveTextContent(
        `{"validTranslation":"validTranslation"}`
      );
    });

    await act(async () => {
      const button = getByText("test button");
      fireEvent.press(button);
    });

    expect(mockWriteBucket).toHaveBeenCalledTimes(1);
    expect(mockWriteBucket).toHaveBeenCalledWith(
      "CAMPAIGN_CONFIGS_STORE",
      JSON.stringify({
        [testCampaignKey]: {
          features: { validFeature: "validFeature" },
          policies: [{ newPolicy: "newPolicy" }],
          c13n: { validTranslation: "validTranslation" },
        },
      }),
      JSON.stringify({
        [testCampaignKey]: {
          features: { validFeature: "validFeature" },
          policies: [{ validPolicy: "validPolicy" }],
          c13n: { validTranslation: "validTranslation" },
        },
      })
    );
    expect(queryByTestId("features")).toHaveTextContent(
      `{"validFeature":"validFeature"}`
    );
    expect(queryByTestId("policies")).toHaveTextContent(
      `[{"newPolicy":"newPolicy"}]`
    );
    expect(queryByTestId("c13n")).toHaveTextContent(
      `{"validTranslation":"validTranslation"}`
    );
  });

  it("should remove a campaign config properly", async () => {
    expect.assertions(10);
    mockReadBucket.mockResolvedValueOnce(
      JSON.stringify({
        [testCampaignKey]: {
          features: { validFeature: "validFeature" },
          policies: [{ validPolicy: "validPolicy" }],
          c13n: { validTranslation: "validTranslation" },
        },
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
              <Text testID="c13n">
                {JSON.stringify(allCampaignConfigs[testCampaignKey]?.c13n)}
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

    expect(mockReadBucket).toHaveBeenCalledTimes(1);
    expect(mockReadBucket).toHaveBeenCalledWith("CAMPAIGN_CONFIGS_STORE");

    await waitFor(() => {
      expect(queryByTestId("features")).toHaveTextContent(
        `{"validFeature":"validFeature"}`
      );
      expect(queryByTestId("policies")).toHaveTextContent(
        `[{"validPolicy":"validPolicy"}]`
      );
      expect(queryByTestId("c13n")).toHaveTextContent(
        `{"validTranslation":"validTranslation"}`
      );
    });

    await act(async () => {
      const button = getByText("test button");
      fireEvent.press(button);
    });

    expect(mockWriteBucket).toHaveBeenCalledTimes(1);
    expect(mockWriteBucket).toHaveBeenCalledWith(
      "CAMPAIGN_CONFIGS_STORE",
      "{}",
      JSON.stringify({
        [testCampaignKey]: {
          features: { validFeature: "validFeature" },
          policies: [{ validPolicy: "validPolicy" }],
          c13n: { validTranslation: "validTranslation" },
        },
      })
    );
    expect(queryByTestId("features")).toHaveTextContent("");
    expect(queryByTestId("policies")).toHaveTextContent("");
    expect(queryByTestId("c13n")).toHaveTextContent("");
  });

  describe("migration from v1 to v2 storage", () => {
    it("should clear v1 storage if there is data in later storage without querying v1 for data", async () => {
      expect.assertions(7);
      mockReadBucket.mockResolvedValueOnce(
        JSON.stringify({
          [testCampaignKey]: {
            features: { validFeature: "validFeature" },
            policies: [{ validPolicy: "validPolicy" }],
            c13n: { validTranslation: "validTranslation" },
          },
        })
      );

      const { queryByTestId, getByTestId } = render(
        <CampaignConfigsStoreContextProvider>
          <CampaignConfigsStoreContext.Consumer>
            {({ hasLoadedFromStore, allCampaignConfigs }) => (
              <>
                {hasLoadedFromStore && (
                  <Text testID="loaded">{`${hasLoadedFromStore}`}</Text>
                )}
                <Text testID="features">
                  {JSON.stringify(
                    allCampaignConfigs[testCampaignKey]?.features
                  )}
                </Text>
                <Text testID="policies">
                  {JSON.stringify(
                    allCampaignConfigs[testCampaignKey]?.policies
                  )}
                </Text>
                <Text testID="c13n">
                  {JSON.stringify(allCampaignConfigs[testCampaignKey]?.c13n)}
                </Text>
              </>
            )}
          </CampaignConfigsStoreContext.Consumer>
        </CampaignConfigsStoreContextProvider>
      );

      expect(mockReadBucket).toHaveBeenCalledTimes(1);
      expect(mockReadBucket).toHaveBeenCalledWith("CAMPAIGN_CONFIGS_STORE");
      expect(queryByTestId("loaded")).toBeNull();

      expect(await waitFor(() => getByTestId("loaded"))).toHaveTextContent(
        "true"
      );

      expect(mockGetItem).not.toHaveBeenCalled();
      expect(mockRemoveItem).toHaveBeenCalledTimes(1);
      expect(mockRemoveItem).toHaveBeenCalledWith("CAMPAIGN_CONFIGS_STORE");
    });

    it("should use v1 storage credentials and migrate to latest store if all later versions are empty", async () => {
      expect.assertions(10);
      mockReadBucket.mockResolvedValueOnce(null);
      mockGetItem.mockResolvedValueOnce(
        JSON.stringify({
          [testCampaignKey]: {
            features: { validFeature: "validFeature" },
            policies: [{ validPolicy: "validPolicy" }],
            c13n: { validTranslation: "validTranslation" },
          },
        })
      );

      const { queryByTestId, getByTestId } = render(
        <CampaignConfigsStoreContextProvider>
          <CampaignConfigsStoreContext.Consumer>
            {({ hasLoadedFromStore, allCampaignConfigs }) => (
              <>
                {hasLoadedFromStore && (
                  <Text testID="loaded">{`${hasLoadedFromStore}`}</Text>
                )}
                <Text testID="features">
                  {JSON.stringify(
                    allCampaignConfigs[testCampaignKey]?.features
                  )}
                </Text>
                <Text testID="policies">
                  {JSON.stringify(
                    allCampaignConfigs[testCampaignKey]?.policies
                  )}
                </Text>
                <Text testID="c13n">
                  {JSON.stringify(allCampaignConfigs[testCampaignKey]?.c13n)}
                </Text>
              </>
            )}
          </CampaignConfigsStoreContext.Consumer>
        </CampaignConfigsStoreContextProvider>
      );

      expect(mockReadBucket).toHaveBeenCalledTimes(1);
      expect(mockReadBucket).toHaveBeenCalledWith("CAMPAIGN_CONFIGS_STORE");
      expect(queryByTestId("loaded")).toBeNull();

      expect(await waitFor(() => getByTestId("loaded"))).toHaveTextContent(
        "true"
      );

      expect(mockGetItem).toHaveBeenCalledTimes(1);
      expect(mockGetItem).toHaveBeenCalledWith("CAMPAIGN_CONFIGS_STORE");
      expect(mockRemoveItem).toHaveBeenCalledTimes(1);
      expect(mockRemoveItem).toHaveBeenCalledWith("CAMPAIGN_CONFIGS_STORE");

      expect(mockWriteBucket).toHaveBeenCalledTimes(1);
      expect(mockWriteBucket).toHaveBeenCalledWith(
        "CAMPAIGN_CONFIGS_STORE",
        JSON.stringify({
          [testCampaignKey]: {
            features: { validFeature: "validFeature" },
            policies: [{ validPolicy: "validPolicy" }],
            c13n: { validTranslation: "validTranslation" },
          },
        }),
        "{}"
      );
    });
  });
});
