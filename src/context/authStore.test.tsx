import React from "react";
import { AuthStoreContextProvider, AuthStoreContext } from "./authStore";
import { render, waitFor, fireEvent } from "@testing-library/react-native";
import { Text, Button } from "react-native";
import { Sentry } from "../utils/errorTracking";
import { ErrorBoundary } from "../components/ErrorBoundary/ErrorBoundary";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  saveToStoreInBuckets,
  readFromStoreInBuckets,
} from "./bucketStorageHelper";

const mockGetItem = AsyncStorage.getItem as jest.Mock;
const mockSetItem = AsyncStorage.setItem as jest.Mock;
const mockRemoveItem = AsyncStorage.removeItem as jest.Mock;
const mockMultiGet = AsyncStorage.multiGet as jest.Mock;
const mockMultiRemove = AsyncStorage.multiRemove as jest.Mock;
jest.mock("./bucketStorageHelper");

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

describe("AuthStoreContextProvider", () => {
  beforeEach(() => {
    mockGetItem.mockReset().mockName("asyncGetItem");
    mockSetItem.mockReset().mockName("asyncSetItem");
    mockRemoveItem.mockReset().mockName("asyncRemoveItem");
    mockMultiGet.mockReset().mockName("asyncMultiGet");
    mockMultiRemove.mockReset().mockName("asyncMultiRemove");
    mockReadBucket.mockReset().mockName("bucketReadItem");
    mockWriteBucket.mockReset().mockName("bucketWriteItem");
    mockCaptureException.mockReset();
  });

  it("should load the auth credentials from the store if it exists", async () => {
    expect.assertions(5);
    mockReadBucket.mockResolvedValueOnce({
      [testCampaignKey]: {
        operatorToken: "operatorToken",
        sessionToken: "sessionToken",
        endpoint: "endpoint",
        expiry: 0,
      },
    });

    const { queryByTestId } = render(
      <AuthStoreContextProvider shouldMigrate={false}>
        <AuthStoreContext.Consumer>
          {({ hasLoadedFromStore, authCredentials }) => (
            <>
              {hasLoadedFromStore && (
                <Text testID="loaded">{`${hasLoadedFromStore}`}</Text>
              )}
              <Text testID="credentials">
                {JSON.stringify(authCredentials[testCampaignKey])}
              </Text>
            </>
          )}
        </AuthStoreContext.Consumer>
      </AuthStoreContextProvider>
    );

    expect(mockReadBucket).toHaveBeenCalledTimes(1);
    expect(mockReadBucket).toHaveBeenCalledWith("AUTH_STORE");
    expect(queryByTestId("loaded")).toBeNull();

    await waitFor(() => {
      expect(queryByTestId("loaded")).toHaveTextContent("true");
      expect(queryByTestId("credentials")).toHaveTextContent(
        `{"operatorToken":"operatorToken","sessionToken":"sessionToken","endpoint":"endpoint","expiry":0}`
      );
    });
  });

  it("should not set auth credentials if it doesn't exist in the store", async () => {
    expect.assertions(3);

    const { queryByTestId } = render(
      <AuthStoreContextProvider shouldMigrate={false}>
        <AuthStoreContext.Consumer>
          {({ authCredentials }) => (
            <Text testID="credentials">
              {JSON.stringify(authCredentials[testCampaignKey])}
            </Text>
          )}
        </AuthStoreContext.Consumer>
      </AuthStoreContextProvider>
    );

    expect(mockReadBucket).toHaveBeenCalledTimes(1);
    expect(mockReadBucket).toHaveBeenCalledWith("AUTH_STORE");

    await waitFor(() => {
      expect(queryByTestId("credentials")).toHaveTextContent("");
    });
  });

  it("should call Sentry when the campaign config from the store is malformed", async () => {
    expect.assertions(3);
    mockReadBucket.mockRejectedValueOnce(new Error("malformed object"));

    render(
      <ErrorBoundary>
        <AuthStoreContextProvider shouldMigrate={false}>
          <AuthStoreContext.Consumer>
            {({ authCredentials }) => (
              <Text testID="credentials">
                {JSON.stringify(authCredentials[testCampaignKey])}
              </Text>
            )}
          </AuthStoreContext.Consumer>
        </AuthStoreContextProvider>
      </ErrorBoundary>
    );

    expect(mockReadBucket).toHaveBeenCalledTimes(1);
    expect(mockReadBucket).toHaveBeenCalledWith("AUTH_STORE");

    await waitFor(() => {
      expect(mockCaptureException).toHaveBeenCalledTimes(1);
    });
  });

  it("should clear the auth credentials and from asyncstorage when clear function is called", async () => {
    expect.assertions(6);
    mockReadBucket.mockResolvedValueOnce({
      [testCampaignKey]: {
        operatorToken: "operatorToken",
        sessionToken: "sessionToken",
        endpoint: "endpoint",
        expiry: 0,
      },
    });

    const { queryByTestId, getByText } = render(
      <AuthStoreContextProvider shouldMigrate={false}>
        <AuthStoreContext.Consumer>
          {({ authCredentials, clearAuthCredentials }) => (
            <>
              <Text testID="credentials">
                {JSON.stringify(authCredentials[testCampaignKey])}
              </Text>
              <Button
                onPress={() => clearAuthCredentials()}
                title="test button"
              />
            </>
          )}
        </AuthStoreContext.Consumer>
      </AuthStoreContextProvider>
    );

    expect(mockReadBucket).toHaveBeenCalledTimes(1);
    expect(mockReadBucket).toHaveBeenCalledWith("AUTH_STORE");

    await waitFor(() => {
      expect(queryByTestId("credentials")).toHaveTextContent(
        `{"operatorToken":"operatorToken","sessionToken":"sessionToken","endpoint":"endpoint","expiry":0}`
      );
    });

    const button = getByText("test button");
    fireEvent.press(button);
    await waitFor(() => {
      expect(mockWriteBucket).toHaveBeenCalledTimes(1);
      expect(mockWriteBucket).toHaveBeenCalledWith(
        "AUTH_STORE",
        {},
        {
          [testCampaignKey]: {
            operatorToken: "operatorToken",
            sessionToken: "sessionToken",
            endpoint: "endpoint",
            expiry: 0,
          },
        },
        7
      );
      expect(queryByTestId("credentials")).toHaveTextContent("");
    });
  });

  it("should add a set of auth credentials properly", async () => {
    expect.assertions(6);
    mockReadBucket.mockResolvedValueOnce({
      [testCampaignKey]: {
        operatorToken: "operatorToken",
        sessionToken: "sessionToken",
        endpoint: "endpoint",
        expiry: 0,
      },
    });

    const { queryByTestId, getByText } = render(
      <AuthStoreContextProvider shouldMigrate={false}>
        <AuthStoreContext.Consumer>
          {({ authCredentials, setAuthCredentials }) => (
            <>
              <Text testID="credentials">
                {JSON.stringify(authCredentials[testCampaignKey])}
              </Text>
              <Button
                onPress={() =>
                  setAuthCredentials(testCampaignKey, {
                    operatorToken: "newOperatorToken",
                    sessionToken: "newSessionToken",
                    endpoint: "newEndpoint",
                    expiry: 0,
                  })
                }
                title="test button"
              />
            </>
          )}
        </AuthStoreContext.Consumer>
      </AuthStoreContextProvider>
    );

    expect(mockReadBucket).toHaveBeenCalledTimes(1);
    expect(mockReadBucket).toHaveBeenCalledWith("AUTH_STORE");

    await waitFor(() => {
      expect(queryByTestId("credentials")).toHaveTextContent(
        `{"operatorToken":"operatorToken","sessionToken":"sessionToken","endpoint":"endpoint","expiry":0}`
      );
    });

    const button = getByText("test button");
    fireEvent.press(button);
    await waitFor(() => {
      expect(mockWriteBucket).toHaveBeenCalledTimes(1);
      expect(mockWriteBucket).toHaveBeenCalledWith(
        "AUTH_STORE",
        {
          [testCampaignKey]: {
            operatorToken: "newOperatorToken",
            sessionToken: "newSessionToken",
            endpoint: "newEndpoint",
            expiry: 0,
          },
        },
        {
          [testCampaignKey]: {
            operatorToken: "operatorToken",
            sessionToken: "sessionToken",
            endpoint: "endpoint",
            expiry: 0,
          },
        },
        7
      );
      expect(queryByTestId("credentials")).toHaveTextContent(
        `{"operatorToken":"newOperatorToken","sessionToken":"newSessionToken","endpoint":"newEndpoint","expiry":0}`
      );
    });
  });

  it("should add a set of auth credentials properly when there are existing credentials for other campaigns", async () => {
    expect.assertions(6);
    mockReadBucket.mockResolvedValueOnce({
      [testCampaignKey]: {
        operatorToken: "operatorToken",
        sessionToken: "sessionToken",
        endpoint: "endpoint",
        expiry: 0,
      },
      "another-test-campaign": {
        operatorToken: "operatorTokenA",
        sessionToken: "sessionTokenA",
        endpoint: "endpointA",
        expiry: 0,
      },
    });

    const { queryByTestId, getByText } = render(
      <AuthStoreContextProvider shouldMigrate={false}>
        <AuthStoreContext.Consumer>
          {({ authCredentials, setAuthCredentials }) => (
            <>
              <Text testID="credentials">
                {JSON.stringify(authCredentials)}
              </Text>
              <Button
                onPress={() =>
                  setAuthCredentials(testCampaignKey, {
                    operatorToken: "newOperatorToken",
                    sessionToken: "newSessionToken",
                    endpoint: "newEndpoint",
                    expiry: 0,
                  })
                }
                title="test button"
              />
            </>
          )}
        </AuthStoreContext.Consumer>
      </AuthStoreContextProvider>
    );

    expect(mockReadBucket).toHaveBeenCalledTimes(1);
    expect(mockReadBucket).toHaveBeenCalledWith("AUTH_STORE");

    await waitFor(() => {
      expect(queryByTestId("credentials")).toHaveTextContent(
        `{"test-campaign":{"operatorToken":"operatorToken","sessionToken":"sessionToken","endpoint":"endpoint","expiry":0},"another-test-campaign":{"operatorToken":"operatorTokenA","sessionToken":"sessionTokenA","endpoint":"endpointA","expiry":0}}`
      );
    });

    const button = getByText("test button");
    fireEvent.press(button);
    await waitFor(() => {
      expect(mockWriteBucket).toHaveBeenCalledTimes(1);
      expect(mockWriteBucket).toHaveBeenCalledWith(
        "AUTH_STORE",
        {
          [testCampaignKey]: {
            operatorToken: "newOperatorToken",
            sessionToken: "newSessionToken",
            endpoint: "newEndpoint",
            expiry: 0,
          },
          "another-test-campaign": {
            operatorToken: "operatorTokenA",
            sessionToken: "sessionTokenA",
            endpoint: "endpointA",
            expiry: 0,
          },
        },
        {
          [testCampaignKey]: {
            operatorToken: "operatorToken",
            sessionToken: "sessionToken",
            endpoint: "endpoint",
            expiry: 0,
          },
          "another-test-campaign": {
            operatorToken: "operatorTokenA",
            sessionToken: "sessionTokenA",
            endpoint: "endpointA",
            expiry: 0,
          },
        },
        7
      );
      expect(queryByTestId("credentials")).toHaveTextContent(
        `{"test-campaign":{"operatorToken":"newOperatorToken","sessionToken":"newSessionToken","endpoint":"newEndpoint","expiry":0},"another-test-campaign":{"operatorToken":"operatorTokenA","sessionToken":"sessionTokenA","endpoint":"endpointA","expiry":0}}`
      );
    });
  });

  it("should remove a set of auth credentials properly", async () => {
    expect.assertions(6);
    mockReadBucket.mockResolvedValueOnce({
      [testCampaignKey]: {
        operatorToken: "operatorToken",
        sessionToken: "sessionToken",
        endpoint: "endpoint",
        expiry: 0,
      },
    });

    const { queryByTestId, getByText } = render(
      <AuthStoreContextProvider shouldMigrate={false}>
        <AuthStoreContext.Consumer>
          {({ authCredentials, removeAuthCredentials }) => (
            <>
              <Text testID="credentials">
                {JSON.stringify(authCredentials[testCampaignKey])}
              </Text>
              <Button
                onPress={() => removeAuthCredentials(testCampaignKey)}
                title="test button"
              />
            </>
          )}
        </AuthStoreContext.Consumer>
      </AuthStoreContextProvider>
    );

    expect(mockReadBucket).toHaveBeenCalledTimes(1);
    expect(mockReadBucket).toHaveBeenCalledWith("AUTH_STORE");

    await waitFor(() => {
      expect(queryByTestId("credentials")).toHaveTextContent(
        `{"operatorToken":"operatorToken","sessionToken":"sessionToken","endpoint":"endpoint","expiry":0}`
      );
    });

    const button = getByText("test button");
    fireEvent.press(button);
    await waitFor(() => {
      expect(mockWriteBucket).toHaveBeenCalledTimes(1);
      expect(mockWriteBucket).toHaveBeenCalledWith(
        "AUTH_STORE",
        {},
        {
          [testCampaignKey]: {
            operatorToken: "operatorToken",
            sessionToken: "sessionToken",
            endpoint: "endpoint",
            expiry: 0,
          },
        },
        7
      );
      expect(queryByTestId("credentials")).toHaveTextContent("");
    });
  });

  describe("migration from v2 to v3 storage", () => {
    it("should clear v2 storage if there are credentials in later storage without querying for data", async () => {
      expect.assertions(8);
      mockReadBucket.mockResolvedValueOnce({
        [testCampaignKey]: {
          operatorToken: "operatorToken",
          sessionToken: "sessionToken",
          endpoint: "endpoint",
          expiry: 0,
        },
      });

      const { queryByTestId, getByTestId } = render(
        <AuthStoreContextProvider shouldMigrate={true}>
          <AuthStoreContext.Consumer>
            {({ authCredentials, hasLoadedFromStore }) => (
              <>
                <Text testID="credentials">
                  {JSON.stringify(authCredentials[testCampaignKey])}
                </Text>
                {hasLoadedFromStore && (
                  <Text testID="loaded">{hasLoadedFromStore}</Text>
                )}
              </>
            )}
          </AuthStoreContext.Consumer>
        </AuthStoreContextProvider>
      );

      expect(mockReadBucket).toHaveBeenCalledTimes(1);
      expect(mockReadBucket).toHaveBeenCalledWith("AUTH_STORE");
      expect(queryByTestId("loaded")).toBeNull();

      expect(await waitFor(() => getByTestId("loaded"))).toHaveTextContent(
        "true"
      );

      expect(mockGetItem).toHaveBeenCalledTimes(0);
      expect(mockRemoveItem).toHaveBeenCalledTimes(1);
      expect(mockRemoveItem).toHaveBeenCalledWith("AUTH_STORE");

      expect(queryByTestId("credentials")).toHaveTextContent(
        `{"operatorToken":"operatorToken","sessionToken":"sessionToken","endpoint":"endpoint","expiry":0}`
      );
    });

    it("should use v2 storage credentials if all later versions are empty", async () => {
      expect.assertions(9);
      mockReadBucket.mockResolvedValueOnce(null);
      mockGetItem.mockResolvedValueOnce(
        JSON.stringify({
          [testCampaignKey]: {
            operatorToken: "operatorToken",
            sessionToken: "sessionToken",
            endpoint: "endpoint",
            expiry: 0,
          },
        })
      );

      const { queryByTestId, getByTestId } = render(
        <AuthStoreContextProvider shouldMigrate={true}>
          <AuthStoreContext.Consumer>
            {({ authCredentials, hasLoadedFromStore }) => (
              <>
                <Text testID="credentials">
                  {JSON.stringify(authCredentials[testCampaignKey])}
                </Text>
                {hasLoadedFromStore && (
                  <Text testID="loaded">{hasLoadedFromStore}</Text>
                )}
              </>
            )}
          </AuthStoreContext.Consumer>
        </AuthStoreContextProvider>
      );

      expect(mockReadBucket).toHaveBeenCalledTimes(1);
      expect(mockReadBucket).toHaveBeenCalledWith("AUTH_STORE");
      expect(queryByTestId("loaded")).toBeNull();

      expect(await waitFor(() => getByTestId("loaded"))).toHaveTextContent(
        "true"
      );

      expect(mockGetItem).toHaveBeenCalledTimes(1);
      expect(mockGetItem).toHaveBeenCalledWith("AUTH_STORE");
      expect(mockRemoveItem).toHaveBeenCalledTimes(1);
      expect(mockRemoveItem).toHaveBeenCalledWith("AUTH_STORE");

      // expect(mockWriteBucket).toHaveBeenCalledTimes(1);
      // expect(mockWriteBucket).toHaveBeenCalledWith({
      //   [testCampaignKey]: {
      //     operatorToken: "operatorToken",
      //     sessionToken: "sessionToken",
      //     endpoint: "endpoint",
      //     expiry: 0,
      //   },
      // });

      expect(queryByTestId("credentials")).toHaveTextContent(
        `{"operatorToken":"operatorToken","sessionToken":"sessionToken","endpoint":"endpoint","expiry":0}`
      );
    });
  });

  describe("migration from v1 to v3 storage", () => {
    it("should clear v1 storage if there are credentials in later storage", async () => {
      expect.assertions(8);
      mockReadBucket.mockResolvedValueOnce({
        [testCampaignKey]: {
          operatorToken: "operatorToken",
          sessionToken: "sessionToken",
          endpoint: "endpoint",
          expiry: 0,
        },
      });

      const { queryByTestId, getByTestId } = render(
        <AuthStoreContextProvider shouldMigrate={true}>
          <AuthStoreContext.Consumer>
            {({ authCredentials, hasLoadedFromStore }) => (
              <>
                <Text testID="credentials">
                  {JSON.stringify(authCredentials[testCampaignKey])}
                </Text>
                {hasLoadedFromStore && (
                  <Text testID="loaded">{hasLoadedFromStore}</Text>
                )}
              </>
            )}
          </AuthStoreContext.Consumer>
        </AuthStoreContextProvider>
      );

      expect(mockReadBucket).toHaveBeenCalledTimes(1);
      expect(mockReadBucket).toHaveBeenCalledWith("AUTH_STORE");
      expect(queryByTestId("loaded")).toBeNull();

      expect(await waitFor(() => getByTestId("loaded"))).toHaveTextContent(
        "true"
      );

      expect(mockMultiGet).toHaveBeenCalledTimes(0);
      expect(mockMultiRemove).toHaveBeenCalledTimes(1);
      expect(mockMultiRemove).toHaveBeenCalledWith([
        "SESSION_TOKEN",
        "EXPIRY_KEY",
        "ENDPOINT_KEY",
      ]);

      expect(queryByTestId("credentials")).toHaveTextContent(
        `{"operatorToken":"operatorToken","sessionToken":"sessionToken","endpoint":"endpoint","expiry":0}`
      );
    });

    it("should use v1 storage credentials if all later versions are empty", async () => {
      expect.assertions(9);
      mockMultiGet.mockResolvedValueOnce([
        ["SESSION_TOKEN", "sessionToken"],
        ["EXPIRY_KEY", 0],
        ["ENDPOINT_KEY", "endpoint"],
      ]);
      mockGetItem.mockResolvedValueOnce(null);
      mockReadBucket.mockResolvedValueOnce(null);

      const { queryByTestId, getByTestId } = render(
        <AuthStoreContextProvider shouldMigrate={true}>
          <AuthStoreContext.Consumer>
            {({ authCredentials, hasLoadedFromStore }) => (
              <>
                <Text testID="credentials">
                  {JSON.stringify(authCredentials["endpoint"])}
                </Text>
                {hasLoadedFromStore && (
                  <Text testID="loaded">{hasLoadedFromStore}</Text>
                )}
              </>
            )}
          </AuthStoreContext.Consumer>
        </AuthStoreContextProvider>
      );

      expect(mockReadBucket).toHaveBeenCalledTimes(1);
      expect(mockReadBucket).toHaveBeenCalledWith("AUTH_STORE");
      expect(queryByTestId("loaded")).toBeNull();

      expect(await waitFor(() => getByTestId("loaded"))).toHaveTextContent(
        "true"
      );

      expect(mockMultiGet).toHaveBeenCalledTimes(1);
      expect(mockMultiGet).toHaveBeenCalledWith([
        "SESSION_TOKEN",
        "EXPIRY_KEY",
        "ENDPOINT_KEY",
      ]);
      expect(mockMultiRemove).toHaveBeenCalledTimes(1);
      expect(mockMultiRemove).toHaveBeenCalledWith([
        "SESSION_TOKEN",
        "EXPIRY_KEY",
        "ENDPOINT_KEY",
      ]);

      // expect(mockWriteBucket).toHaveBeenCalledTimes(1);
      // expect(mockWriteBucket).toHaveBeenCalledWith({
      //   [testCampaignKey]: {
      //     operatorToken: "",
      //     sessionToken: "sessionToken",
      //     endpoint: "endpoint",
      //     expiry: 0,
      //   },
      // });

      expect(queryByTestId("credentials")).toHaveTextContent(
        `{"operatorToken":"","sessionToken":"sessionToken","endpoint":"endpoint","expiry":0}`
      );
    });

    it("should not migrate v1 credentials if v2 is not empty", async () => {
      expect.assertions(6);
      mockGetItem.mockResolvedValueOnce(
        JSON.stringify({
          [testCampaignKey]: {
            operatorToken: "operatorToken",
            sessionToken: "sessionToken",
            endpoint: "endpoint",
            expiry: 0,
          },
        })
      );
      mockReadBucket.mockResolvedValueOnce(null);

      const { getByTestId } = render(
        <AuthStoreContextProvider shouldMigrate={true}>
          <AuthStoreContext.Consumer>
            {({ authCredentials, hasLoadedFromStore }) => (
              <>
                <Text testID="credentials">
                  {JSON.stringify(authCredentials[testCampaignKey])}
                </Text>
                {hasLoadedFromStore && (
                  <Text testID="loaded">{hasLoadedFromStore}</Text>
                )}
              </>
            )}
          </AuthStoreContext.Consumer>
        </AuthStoreContextProvider>
      );

      expect(mockReadBucket).toHaveBeenCalledTimes(1);
      expect(mockReadBucket).toHaveBeenCalledWith("AUTH_STORE");

      await waitFor(() =>
        expect(getByTestId("loaded")).toHaveTextContent("true")
      );

      expect(mockMultiGet).not.toHaveBeenCalled();
      expect(mockRemoveItem).toHaveBeenCalledTimes(1);
      expect(mockRemoveItem).toHaveBeenCalledWith("AUTH_STORE");
    });
  });
});
