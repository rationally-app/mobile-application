import React from "react";
import { AuthStoreContextProvider, AuthStoreContext } from "./authStore";
import { render, waitFor, fireEvent } from "@testing-library/react-native";
import { Text, Button } from "react-native";
import { Sentry } from "../utils/errorTracking";
import { ErrorBoundary } from "../components/ErrorBoundary/ErrorBoundary";
import AsyncStorage from "@react-native-async-storage/async-storage";

const mockGetItem = AsyncStorage.getItem as jest.Mock;
const mockSetItem = AsyncStorage.setItem as jest.Mock;

jest.mock("../utils/errorTracking");
const mockCaptureException = jest.fn();
(Sentry.captureException as jest.Mock).mockImplementation(mockCaptureException);

const testCampaignKey = "test-campaign";

describe("AuthStoreContextProvider", () => {
  beforeEach(() => {
    mockGetItem.mockReset();
    mockSetItem.mockReset();
    mockCaptureException.mockReset();
  });

  it("should load the auth credentials from the store if it exists", async () => {
    expect.assertions(5);
    mockGetItem.mockImplementationOnce(() =>
      JSON.stringify({
        [testCampaignKey]: {
          operatorToken: "operatorToken",
          sessionToken: "sessionToken",
          endpoint: "endpoint",
          expiry: 0,
        },
      })
    );

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

    expect(mockGetItem).toHaveBeenCalledTimes(1);
    expect(mockGetItem).toHaveBeenCalledWith("AUTH_STORE");
    expect(queryByTestId("loaded")).toBeNull();

    await waitFor(() => {
      expect(queryByTestId("credentials")).toHaveTextContent(
        `{"operatorToken":"operatorToken","sessionToken":"sessionToken","endpoint":"endpoint","expiry":0}`
      );
      expect(queryByTestId("loaded")).toHaveTextContent("true");
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

    expect(mockGetItem).toHaveBeenCalledTimes(1);
    expect(mockGetItem).toHaveBeenCalledWith("AUTH_STORE");

    await waitFor(() => {
      expect(queryByTestId("credentials")).toHaveTextContent("");
    });
  });

  it("should call Sentry when the campaign config from the store is malformed", async () => {
    expect.assertions(3);
    mockGetItem.mockImplementationOnce(() => "malformed object");

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

    expect(mockGetItem).toHaveBeenCalledTimes(1);
    expect(mockGetItem).toHaveBeenCalledWith("AUTH_STORE");

    await waitFor(() => {
      expect(mockCaptureException).toHaveBeenCalledTimes(1);
    });
  });

  it("should clear the auth credentials and from asyncstorage when clear function is called", async () => {
    expect.assertions(6);
    mockGetItem.mockImplementationOnce(() =>
      JSON.stringify({
        [testCampaignKey]: {
          operatorToken: "operatorToken",
          sessionToken: "sessionToken",
          endpoint: "endpoint",
          expiry: 0,
        },
      })
    );

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

    expect(mockGetItem).toHaveBeenCalledTimes(1);
    expect(mockGetItem).toHaveBeenCalledWith("AUTH_STORE");

    await waitFor(() => {
      expect(queryByTestId("credentials")).toHaveTextContent(
        `{"operatorToken":"operatorToken","sessionToken":"sessionToken","endpoint":"endpoint","expiry":0}`
      );
    });

    const button = getByText("test button");
    fireEvent.press(button);
    await waitFor(() => {
      expect(mockSetItem).toHaveBeenCalledTimes(1);
      expect(mockSetItem).toHaveBeenCalledWith("AUTH_STORE", "{}");
      expect(queryByTestId("credentials")).toHaveTextContent("");
    });
  });

  it("should add a set of auth credentials properly", async () => {
    expect.assertions(6);
    mockGetItem.mockImplementationOnce(() =>
      JSON.stringify({
        [testCampaignKey]: {
          operatorToken: "operatorToken",
          sessionToken: "sessionToken",
          endpoint: "endpoint",
          expiry: 0,
        },
      })
    );

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

    expect(mockGetItem).toHaveBeenCalledTimes(1);
    expect(mockGetItem).toHaveBeenCalledWith("AUTH_STORE");

    await waitFor(() => {
      expect(queryByTestId("credentials")).toHaveTextContent(
        `{"operatorToken":"operatorToken","sessionToken":"sessionToken","endpoint":"endpoint","expiry":0}`
      );
    });

    const button = getByText("test button");
    fireEvent.press(button);
    await waitFor(() => {
      expect(mockSetItem).toHaveBeenCalledTimes(1);
      expect(mockSetItem).toHaveBeenCalledWith(
        "AUTH_STORE",
        JSON.stringify({
          [testCampaignKey]: {
            operatorToken: "newOperatorToken",
            sessionToken: "newSessionToken",
            endpoint: "newEndpoint",
            expiry: 0,
          },
        })
      );
      expect(queryByTestId("credentials")).toHaveTextContent(
        `{"operatorToken":"newOperatorToken","sessionToken":"newSessionToken","endpoint":"newEndpoint","expiry":0}`
      );
    });
  });

  it("should add a set of auth credentials properly when there are existing credentials for other campaigns", async () => {
    expect.assertions(6);
    mockGetItem.mockImplementationOnce(() =>
      JSON.stringify({
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
      })
    );

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

    expect(mockGetItem).toHaveBeenCalledTimes(1);
    expect(mockGetItem).toHaveBeenCalledWith("AUTH_STORE");

    await waitFor(() => {
      expect(queryByTestId("credentials")).toHaveTextContent(
        `{"test-campaign":{"operatorToken":"operatorToken","sessionToken":"sessionToken","endpoint":"endpoint","expiry":0},"another-test-campaign":{"operatorToken":"operatorTokenA","sessionToken":"sessionTokenA","endpoint":"endpointA","expiry":0}}`
      );
    });

    const button = getByText("test button");
    fireEvent.press(button);
    await waitFor(() => {
      expect(mockSetItem).toHaveBeenCalledTimes(1);
      expect(mockSetItem).toHaveBeenCalledWith(
        "AUTH_STORE",
        JSON.stringify({
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
        })
      );
      expect(queryByTestId("credentials")).toHaveTextContent(
        `{"test-campaign":{"operatorToken":"newOperatorToken","sessionToken":"newSessionToken","endpoint":"newEndpoint","expiry":0},"another-test-campaign":{"operatorToken":"operatorTokenA","sessionToken":"sessionTokenA","endpoint":"endpointA","expiry":0}}`
      );
    });
  });

  it("should remove a set of auth credentials properly", async () => {
    expect.assertions(6);
    mockGetItem.mockImplementationOnce(() =>
      JSON.stringify({
        [testCampaignKey]: {
          operatorToken: "operatorToken",
          sessionToken: "sessionToken",
          endpoint: "endpoint",
          expiry: 0,
        },
      })
    );

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

    expect(mockGetItem).toHaveBeenCalledTimes(1);
    expect(mockGetItem).toHaveBeenCalledWith("AUTH_STORE");

    await waitFor(() => {
      expect(queryByTestId("credentials")).toHaveTextContent(
        `{"operatorToken":"operatorToken","sessionToken":"sessionToken","endpoint":"endpoint","expiry":0}`
      );
    });

    const button = getByText("test button");
    fireEvent.press(button);
    await waitFor(() => {
      expect(mockSetItem).toHaveBeenCalledTimes(1);
      expect(mockSetItem).toHaveBeenCalledWith("AUTH_STORE", "{}");
      expect(queryByTestId("credentials")).toHaveTextContent("");
    });
  });
});
