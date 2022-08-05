import { render, waitFor } from "@testing-library/react-native";
import React, { ContextType } from "react";
import { AlertModalContext } from "../../context/alert";
import { AuthStoreContext } from "../../context/authStore";
import { CampaignConfigsStoreContext } from "../../context/campaignConfigsStore";
import { AppMode, ConfigContext } from "../../context/config";
import { ImportantMessageSetterContext } from "../../context/importantMessage";
import { callLogout, LogoutError } from "../../services/auth";
import { NetworkError } from "../../services/helpers";
import { AuthCredentials } from "../../types";
import { Sentry } from "../../utils/errorTracking";
import { ErrorBoundary } from "../ErrorBoundary/ErrorBoundary";
import { LogoutScreen } from "./LogoutScreen";

jest.mock("../../utils/errorTracking");
jest.mock("../../services/auth", () => ({
  ...jest.requireActual("../../services/auth"),
  callLogout: jest.fn(),
}));

const mockCaptureException = Sentry.captureException as jest.MockedFunction<
  typeof Sentry.captureException
>;

const mockNavigate = jest.fn();
const mockNavigation: any = {
  navigate: mockNavigate,
};
const mockRoute: any = {
  params: {},
};
const mockCallLogout = callLogout as jest.MockedFunction<typeof callLogout>;

describe("LogoutScreen", () => {
  let keyA: string;
  let keyB: string;
  let keyC: string;

  let authA: AuthCredentials;
  let authB: AuthCredentials;
  let authC: AuthCredentials;

  let authCredentials: { [key: string]: AuthCredentials };

  let defaultAuthStoreContextValue: ContextType<typeof AuthStoreContext>;
  let defaultCampaignConfigStoreContextValue: ContextType<
    typeof CampaignConfigsStoreContext
  >;
  let defaultConfigContextProviderValue: ContextType<typeof ConfigContext>;

  beforeAll(() => {
    keyA = "keyA";
    keyB = "keyB";
    keyC = "keyC";

    authA = {
      endpoint: "endA",
      expiry: 0,
      operatorToken: "optA",
      sessionToken: "sesA",
    };
    authB = {
      endpoint: "endB",
      expiry: 0,
      operatorToken: "optB",
      sessionToken: "sesB",
    };
    authC = {
      endpoint: "endC",
      expiry: 0,
      operatorToken: "optC",
      sessionToken: "sesC",
    };

    authCredentials = {
      [keyA]: authA,
      [keyB]: authB,
      [keyC]: authC,
    };

    defaultAuthStoreContextValue = {
      authCredentials: authCredentials,
      clearAuthCredentials: jest.fn(),
      hasLoadedFromStore: true,
      removeAuthCredentials: jest.fn(),
      setAuthCredentials: jest.fn(),
    };

    defaultCampaignConfigStoreContextValue = {
      allCampaignConfigs: {},
      clearCampaignConfigs: jest.fn(),
      hasLoadedFromStore: true,
      removeCampaignConfig: jest.fn(),
      setCampaignConfig: jest.fn(),
    };

    defaultConfigContextProviderValue = {
      config: { appMode: AppMode.production },
      setConfigValue: jest.fn(),
    };
  });

  beforeEach(() => {
    mockCaptureException.mockReset().mockName("captureException");
    mockNavigate.mockReset().mockName("navigate");
    mockCallLogout.mockReset().mockName("callLogout");
  });

  it("should attempt logout from all campaigns", async () => {
    expect.assertions(5);

    render(
      <ConfigContext.Provider value={defaultConfigContextProviderValue}>
        <AuthStoreContext.Provider value={defaultAuthStoreContextValue}>
          <CampaignConfigsStoreContext.Provider
            value={defaultCampaignConfigStoreContextValue}
          >
            <ImportantMessageSetterContext.Provider value={jest.fn()}>
              <LogoutScreen navigation={mockNavigation} route={mockRoute} />
            </ImportantMessageSetterContext.Provider>
          </CampaignConfigsStoreContext.Provider>
        </AuthStoreContext.Provider>
      </ConfigContext.Provider>
    );

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledTimes(1));

    expect(mockCallLogout).toHaveBeenCalledTimes(3);
    expect(mockCallLogout).toHaveBeenCalledWith("sesA", "optA", "endA");
    expect(mockCallLogout).toHaveBeenCalledWith("sesB", "optB", "endB");
    expect(mockCallLogout).toHaveBeenCalledWith("sesC", "optC", "endC");
  });

  describe("when all campaigns logout successfully", () => {
    it("should clear all credentials and configs and move to login screen", async () => {
      expect.assertions(4);

      const mockClearAuthCredentials = jest.fn();
      const mockClearCampaignConfigs = jest.fn();

      render(
        <AuthStoreContext.Provider
          value={{
            ...defaultAuthStoreContextValue,
            clearAuthCredentials: mockClearAuthCredentials,
          }}
        >
          <CampaignConfigsStoreContext.Provider
            value={{
              ...defaultCampaignConfigStoreContextValue,
              clearCampaignConfigs: mockClearCampaignConfigs,
            }}
          >
            <LogoutScreen navigation={mockNavigation} route={mockRoute} />
          </CampaignConfigsStoreContext.Provider>
        </AuthStoreContext.Provider>
      );

      await waitFor(() => expect(mockNavigate).toHaveBeenCalledTimes(1));

      expect(mockNavigate).toHaveBeenCalledWith("LoginScreen");
      expect(mockClearAuthCredentials).toHaveBeenCalledTimes(1);
      expect(mockClearCampaignConfigs).toHaveBeenCalledTimes(1);
    });
  });

  describe("when there are errors logging out some campaigns", () => {
    it("should only logout from campaigns with no error and not clear all credentials", async () => {
      expect.assertions(11);

      mockCallLogout.mockImplementation(async (sessionToken) => {
        if (sessionToken === "sesA") throw new LogoutError("");
      });
      const mockRemoveAuthCredentials = jest
        .fn()
        .mockName("removeAuthCredentials");
      const mockRemoveCampaignConfig = jest
        .fn()
        .mockName("removeCampaignConfig");

      const mockClearAuthCredentials = jest
        .fn()
        .mockName("clearAuthCredentials");
      const mockClearCampaignConfigs = jest
        .fn()
        .mockName("clearCampaignConfigs");

      render(
        <AuthStoreContext.Provider
          value={{
            ...defaultAuthStoreContextValue,
            removeAuthCredentials: mockRemoveAuthCredentials,
            clearAuthCredentials: mockClearAuthCredentials,
          }}
        >
          <CampaignConfigsStoreContext.Provider
            value={{
              ...defaultCampaignConfigStoreContextValue,
              removeCampaignConfig: mockRemoveCampaignConfig,
              clearCampaignConfigs: mockClearCampaignConfigs,
            }}
          >
            <LogoutScreen navigation={mockNavigation} route={mockRoute} />
          </CampaignConfigsStoreContext.Provider>
        </AuthStoreContext.Provider>
      );

      await waitFor(() => expect(mockNavigate).toHaveBeenCalledTimes(1));

      expect(mockRemoveAuthCredentials).toHaveBeenCalledTimes(2);
      expect(mockRemoveAuthCredentials).not.toHaveBeenCalledWith(keyA);
      expect(mockRemoveAuthCredentials).toHaveBeenCalledWith(keyB);
      expect(mockRemoveAuthCredentials).toHaveBeenCalledWith(keyC);

      expect(mockRemoveCampaignConfig).toHaveBeenCalledTimes(2);
      expect(mockRemoveCampaignConfig).not.toHaveBeenCalledWith(keyA);
      expect(mockRemoveCampaignConfig).toHaveBeenCalledWith(keyB);
      expect(mockRemoveCampaignConfig).toHaveBeenCalledWith(keyC);

      expect(mockClearAuthCredentials).not.toHaveBeenCalled();
      expect(mockClearCampaignConfigs).not.toHaveBeenCalled();
    });

    describe("when LogoutError is thrown", () => {
      it("should move to campaign selection screen", async () => {
        expect.assertions(2);

        mockCallLogout.mockRejectedValue(new LogoutError(""));

        render(
          <AuthStoreContext.Provider value={defaultAuthStoreContextValue}>
            <CampaignConfigsStoreContext.Provider
              value={defaultCampaignConfigStoreContextValue}
            >
              <LogoutScreen navigation={mockNavigation} route={mockRoute} />
            </CampaignConfigsStoreContext.Provider>
          </AuthStoreContext.Provider>
        );

        await waitFor(() => expect(mockNavigate).toHaveBeenCalledTimes(1));

        expect(mockNavigate).toHaveBeenCalledWith("DrawerNavigator", {
          screen: "CampaignLocationsScreen",
          params: {
            shouldAutoLoad: false,
          },
        });
      });

      it("should display an alert modal", async () => {
        expect.assertions(3);

        mockCallLogout.mockRejectedValue(new LogoutError(""));
        const showErrorAlert = jest.fn();

        render(
          <AlertModalContext.Provider
            value={{
              clearAlert: jest.fn(),
              showConfirmationAlert: jest.fn(),
              showErrorAlert,
              showWarnAlert: jest.fn(),
            }}
          >
            <AuthStoreContext.Provider value={defaultAuthStoreContextValue}>
              <CampaignConfigsStoreContext.Provider
                value={defaultCampaignConfigStoreContextValue}
              >
                <LogoutScreen navigation={mockNavigation} route={mockRoute} />
              </CampaignConfigsStoreContext.Provider>
            </AuthStoreContext.Provider>
          </AlertModalContext.Provider>
        );

        await waitFor(() => expect(mockNavigate).toHaveBeenCalledTimes(1));

        expect(showErrorAlert).toHaveBeenCalledTimes(1);
        expect(showErrorAlert).toHaveBeenCalledWith(new LogoutError(""));
      });
    });

    describe("when other errors are thrown", () => {
      it("should let error boundary handle", async () => {
        expect.assertions(4);

        mockCallLogout.mockRejectedValueOnce(new NetworkError(""));
        const showErrorAlert = jest.fn();

        render(
          <ErrorBoundary>
            <AlertModalContext.Provider
              value={{
                clearAlert: jest.fn(),
                showConfirmationAlert: jest.fn(),
                showErrorAlert,
                showWarnAlert: jest.fn(),
              }}
            >
              <AuthStoreContext.Provider value={defaultAuthStoreContextValue}>
                <CampaignConfigsStoreContext.Provider
                  value={defaultCampaignConfigStoreContextValue}
                >
                  <LogoutScreen navigation={mockNavigation} route={mockRoute} />
                </CampaignConfigsStoreContext.Provider>
              </AuthStoreContext.Provider>
            </AlertModalContext.Provider>
          </ErrorBoundary>
        );

        // called twice, one in logout screen when capturing all exceptions and one
        // at ErrorBoundary
        await waitFor(() =>
          expect(mockCaptureException).toHaveBeenCalledTimes(2)
        );
        expect(mockCaptureException).toHaveBeenCalledWith(new NetworkError(""));

        expect(showErrorAlert).not.toHaveBeenCalled();
        expect(mockNavigate).not.toHaveBeenCalled();
      });
    });
  });
});
