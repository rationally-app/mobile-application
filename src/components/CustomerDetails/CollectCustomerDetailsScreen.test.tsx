/* eslint-disable react/display-name */
import {
  render,
  cleanup,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react-native";
import React from "react";
import { Sentry } from "../../utils/errorTracking";
import * as validateIdentification from "../../utils/validateIdentification";
import { CampaignConfigsMap } from "../../context/campaignConfigsStore";
import { CampaignConfigContextProvider } from "../../context/campaignConfig";
import { AlertModalContextProvider, ERROR_MESSAGE } from "../../context/alert";
import { CreateProvidersWrapper } from "../../test/helpers/providers";
import { defaultFeatures, defaultProducts } from "../../test/helpers/defaults";
import { CollectCustomerDetailsScreen } from "./CollectCustomerDetailsScreen";
import "../../common/i18n/i18nMock";
import { IdentificationContextProvider } from "../../context/identification";

jest.mock("../../utils/errorTracking");
const mockCaptureException = jest.fn();
(Sentry.captureException as jest.Mock).mockImplementation(mockCaptureException);

const mockedUseNavigation = jest.fn();
jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native");
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockedUseNavigation,
    }),
    useIsFocused: jest.fn(),
  };
});

const mockNavigate: any = {
  navigate: jest.fn(),
};
const mockRoute: any = {
  params: {},
};
const mockValidateAndCleanId = jest.spyOn(
  validateIdentification,
  "validateAndCleanId"
);

const identityDetailsInputTestId = "identity-details-input";
const alternateIdInputTestId = "input-with-label-input";
const checkButtonText = "Check";
const passportCountryInputPlaceholderText = "Search country";
const COUNTRY = "Afghanistan";
const continueAppButtonId = "continue-app";

describe("CollectCustomerDetailsScreen", () => {
  let allCampaignConfigs: CampaignConfigsMap;

  beforeAll(() => {
    allCampaignConfigs = {
      campaignA: {
        features: {
          ...defaultFeatures,
          id: {
            label: "NRIC/FIN",
            type: "STRING",
            scannerType: "QR",
            validation: "NRIC",
          },
          alternateIds: [
            {
              label: "Passport",
              type: "STRING",
              scannerType: "NONE",
              validation: "PASSPORT",
            },
          ],
          campaignName: "Some Campaign Name",
        },
        policies: [defaultProducts[0]],
        c13n: {},
      },
    };
  });

  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
  });

  describe("using nric", () => {
    it("should navigate correctly with valid id input", async () => {
      expect.assertions(5);
      mockValidateAndCleanId.mockReturnValue("valid-id");

      const { queryByText, queryByTestId, getByTestId } = render(
        <CreateProvidersWrapper
          providers={[
            {
              provider: CampaignConfigContextProvider,
              props: { campaignConfig: allCampaignConfigs.campaignA },
            },
            { provider: IdentificationContextProvider },
          ]}
        >
          <CollectCustomerDetailsScreen
            navigation={mockNavigate}
            route={mockRoute}
          />
        </CreateProvidersWrapper>
      );

      const continueAppButton = getByTestId(continueAppButtonId);
      await act(async () => fireEvent.press(continueAppButton));
      const identityDetailsInput = queryByTestId(identityDetailsInputTestId);
      const checkButton = queryByText(checkButtonText);
      expect(identityDetailsInput).not.toBeNull();
      expect(checkButton).not.toBeNull();

      fireEvent(identityDetailsInput!, "onChange", {
        nativeEvent: { text: "valid-id" },
      });
      expect(identityDetailsInput!.props["value"]).toBe("valid-id");

      fireEvent.press(checkButton!);
      expect(mockValidateAndCleanId).toHaveBeenCalledTimes(1);

      expect(mockNavigate.navigate).toHaveBeenCalledWith(
        "Customer Quota Proxy",
        {
          id: "valid-id",
          products: [defaultProducts[0]],
        }
      );
    });

    it("should throw error when input id is invalid", async () => {
      expect.assertions(7);
      mockValidateAndCleanId.mockImplementationOnce(() => {
        throw new Error(ERROR_MESSAGE.INVALID_ID);
      });

      const { queryByText, queryByTestId, getByTestId } = render(
        <CreateProvidersWrapper
          providers={[
            { provider: AlertModalContextProvider },
            {
              provider: CampaignConfigContextProvider,
              props: { campaignConfig: allCampaignConfigs.campaignA },
            },
            { provider: IdentificationContextProvider },
          ]}
        >
          <CollectCustomerDetailsScreen
            navigation={mockNavigate}
            route={mockRoute}
          />
        </CreateProvidersWrapper>
      );

      const continueAppButton = getByTestId(continueAppButtonId);
      await act(async () => fireEvent.press(continueAppButton));
      const identityDetailsInput = queryByTestId(identityDetailsInputTestId);
      const checkButton = queryByText(checkButtonText);
      expect(identityDetailsInput).not.toBeNull();
      expect(checkButton).not.toBeNull();

      fireEvent(identityDetailsInput!, "onChange", {
        nativeEvent: { text: "invalid-id" },
      });
      expect(identityDetailsInput!.props["value"]).toBe("invalid-id");

      fireEvent.press(checkButton!);
      expect(mockValidateAndCleanId).toHaveBeenCalledTimes(1);

      await waitFor(() => {
        expect(queryByText("Invalid input")).not.toBeNull();
        expect(queryByText("Enter or scan a valid ID number.")).not.toBeNull();
      });

      expect(mockNavigate.navigate).not.toHaveBeenCalled();
    });
  });

  describe("using alternate id", () => {
    it("should navigate correctly using valid alternate id", async () => {
      expect.assertions(10);
      mockValidateAndCleanId.mockReturnValue("valid-alternate-id");

      const {
        queryByText,
        queryByTestId,
        queryAllByPlaceholderText,
        getByTestId,
      } = render(
        <CreateProvidersWrapper
          providers={[
            { provider: AlertModalContextProvider },
            {
              provider: CampaignConfigContextProvider,
              props: { campaignConfig: allCampaignConfigs.campaignA },
            },
            { provider: IdentificationContextProvider },
          ]}
        >
          <CollectCustomerDetailsScreen
            navigation={mockNavigate}
            route={mockRoute}
          />
        </CreateProvidersWrapper>
      );

      const continueAppButton = getByTestId(continueAppButtonId);
      await act(async () => fireEvent.press(continueAppButton));

      const alternateIdTab = queryByText("Passport");
      expect(alternateIdTab).not.toBeNull();

      fireEvent.press(alternateIdTab!);
      expect(queryByText("Passport number")).not.toBeNull();

      const viewDropdownModal = queryByTestId("dropdown-filter-view");
      if (viewDropdownModal) {
        fireEvent(viewDropdownModal, "onTouchStart");
      }
      const passportNumberInput = queryByTestId(alternateIdInputTestId);
      const passportCountryInput = queryAllByPlaceholderText(
        passportCountryInputPlaceholderText
      );
      const selectedCountry = queryByText(COUNTRY);
      const checkButton = queryByText(checkButtonText);
      expect(passportNumberInput).not.toBeNull();
      expect(passportCountryInput).toHaveLength(2);
      expect(selectedCountry).not.toBeNull();
      expect(checkButton).not.toBeNull();

      fireEvent.press(selectedCountry!);
      expect(passportCountryInput[1]!.props["children"]).toEqual(COUNTRY);

      fireEvent(passportNumberInput!, "onChange", {
        nativeEvent: { text: "valid-alternate-id" },
      });
      expect(passportNumberInput!.props["value"]).toBe("valid-alternate-id");

      fireEvent.press(checkButton!);
      expect(mockValidateAndCleanId).toHaveBeenCalledTimes(1);

      expect(mockNavigate.navigate).toHaveBeenCalledWith(
        "Customer Quota Proxy",
        {
          id: "valid-alternate-id",
          products: [defaultProducts[0]],
        }
      );
    });

    it("should throw error when alternate id is invalid", async () => {
      expect.assertions(12);
      mockValidateAndCleanId.mockImplementationOnce(() => {
        throw new Error(ERROR_MESSAGE.INVALID_ID);
      });

      const {
        queryByText,
        queryByTestId,
        queryAllByPlaceholderText,
        getByTestId,
      } = render(
        <CreateProvidersWrapper
          providers={[
            { provider: AlertModalContextProvider },
            {
              provider: CampaignConfigContextProvider,
              props: { campaignConfig: allCampaignConfigs.campaignA },
            },
            { provider: IdentificationContextProvider },
          ]}
        >
          <CollectCustomerDetailsScreen
            navigation={mockNavigate}
            route={mockRoute}
          />
        </CreateProvidersWrapper>
      );

      const continueAppButton = getByTestId(continueAppButtonId);
      await act(async () => fireEvent.press(continueAppButton));

      const alternateIdTab = queryByText("Passport");
      expect(alternateIdTab).not.toBeNull();

      fireEvent.press(alternateIdTab!);
      expect(queryByText("Passport number")).not.toBeNull();

      const viewDropdownModal = queryByTestId("dropdown-filter-view");
      if (viewDropdownModal) {
        fireEvent(viewDropdownModal, "onTouchStart");
      }
      const passportNumberInput = queryByTestId(alternateIdInputTestId);
      const passportCountryInput = queryAllByPlaceholderText(
        passportCountryInputPlaceholderText
      );
      const selectedCountry = queryByText(COUNTRY);
      const checkButton = queryByText(checkButtonText);
      expect(passportNumberInput).not.toBeNull();
      expect(passportCountryInput).toHaveLength(2);
      expect(selectedCountry).not.toBeNull();
      expect(checkButton).not.toBeNull();

      fireEvent.press(selectedCountry!);
      expect(passportCountryInput[1]!.props["children"]).toEqual(COUNTRY);

      fireEvent(passportNumberInput!, "onChange", {
        nativeEvent: { text: "invalid-alternate-id" },
      });
      expect(passportNumberInput!.props["value"]).toBe("invalid-alternate-id");

      fireEvent.press(checkButton!);
      expect(mockValidateAndCleanId).toHaveBeenCalledTimes(1);

      await waitFor(() => {
        expect(queryByText("Invalid input")).not.toBeNull();
        expect(queryByText("Enter or scan a valid ID number.")).not.toBeNull();
      });

      expect(mockNavigate.navigate).not.toHaveBeenCalled();
    });
  });
});
