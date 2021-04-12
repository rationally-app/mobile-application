import { render, cleanup, fireEvent } from "@testing-library/react-native";
import React, { FunctionComponent } from "react";
import { Sentry } from "../../utils/errorTracking";
import * as navigation from "../../common/navigation";
import { CampaignConfigsMap } from "../../context/campaignConfigsStore";
import { CampaignConfigContextProvider } from "../../context/campaignConfig";
import { CreateProvidersWrapper } from "../../test/helpers/providers";
import { defaultFeatures } from "../../test/helpers/defaults";
import { CustomerAppealScreen } from "./CustomerAppealScreen";
import "../../common/i18n/i18nMock";

jest.mock("../../utils/errorTracking");
const mockCaptureException = jest.fn();
(Sentry.captureException as jest.Mock).mockImplementation(mockCaptureException);

const mockPushRoute = jest.spyOn(navigation, "pushRoute");
const mockNavigate: any = {
  navigate: jest.fn(),
  getParam: (id: string) => ["valid-id"],
};

jest.mock("react-navigation", () => ({
  withNavigation: (Component: FunctionComponent) => (props: any) => (
    <Component navigation={mockNavigate} {...props} />
  ),
  withNavigationFocus: (Component: FunctionComponent) => (props: any) => (
    <Component navigation={mockNavigate} {...props} />
  ),
}));

describe("CustomerAppealScreen", () => {
  let allCampaignConfigs: CampaignConfigsMap;

  beforeAll(() => {
    allCampaignConfigs = {
      campaignA: {
        features: {
          ...defaultFeatures,
          id: {
            type: "STRING",
            scannerType: "QR",
            validation: "NRIC",
          },
          campaignName: "Some Campaign Name",
        },
        policies: [
          {
            category: "toilet-paper",
            categoryType: "APPEAL",
            name: "Toilet Paper",
            order: 1,
            quantity: {
              period: 7,
              limit: 2,
            },
          },
          {
            category: "soap",
            categoryType: "APPEAL",
            name: "Soap",
            order: 1,
            quantity: {
              period: 7,
              limit: 2,
            },
          },
        ],
        c13n: {},
      },
    };
  });

  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
  });
  it("should render the screen correctly", async () => {
    expect.assertions(2);

    const { queryByText } = render(
      <CreateProvidersWrapper
        providers={[
          {
            provider: CampaignConfigContextProvider,
            props: { campaignConfig: allCampaignConfigs.campaignA },
          },
        ]}
      >
        <CustomerAppealScreen navigation={mockNavigate} />
      </CreateProvidersWrapper>
    );

    expect(queryByText("Toilet Paper")).not.toBeNull();
    expect(queryByText("Soap")).not.toBeNull();
  });

  it("should navigate to the selected reason", async () => {
    expect.assertions(2);

    const { queryByText } = render(
      <CreateProvidersWrapper
        providers={[
          {
            provider: CampaignConfigContextProvider,
            props: { campaignConfig: allCampaignConfigs.campaignA },
          },
        ]}
      >
        <CustomerAppealScreen navigation={mockNavigate} />
      </CreateProvidersWrapper>
    );

    const reasonOne = queryByText("Toilet Paper");
    expect(reasonOne).not.toBeNull();

    fireEvent.press(reasonOne!);
    expect(mockPushRoute).toHaveBeenCalledWith(
      mockNavigate,
      "CustomerQuotaProxy",
      {
        id: ["valid-id"],
        products: [
          {
            category: "toilet-paper",
            categoryType: "APPEAL",
            name: "Toilet Paper",
            order: 1,
            quantity: {
              period: 7,
              limit: 2,
            },
          },
        ],
      }
    );
  });
});
