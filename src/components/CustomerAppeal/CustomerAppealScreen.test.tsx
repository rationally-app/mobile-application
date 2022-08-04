/* eslint-disable react/display-name */
import { render, cleanup, fireEvent } from "@testing-library/react-native";
import React from "react";
import { Sentry } from "../../utils/errorTracking";
import { CampaignConfigsMap } from "../../context/campaignConfigsStore";
import { CampaignConfigContextProvider } from "../../context/campaignConfig";
import { CreateProvidersWrapper } from "../../test/helpers/providers";
import { defaultFeatures } from "../../test/helpers/defaults";
import { CustomerAppealScreen } from "./CustomerAppealScreen";
import "../../common/i18n/i18nMock";
import { StackActions } from "@react-navigation/native";

jest.mock("../../utils/errorTracking");
const mockCaptureException = jest.fn();
(Sentry.captureException as jest.Mock).mockImplementation(mockCaptureException);

const mockStackedActionsPush = jest.spyOn(StackActions, "push");
const mockedDispatch = jest.fn();
const mockNavigate: any = {
  dispatch: mockedDispatch,
  getParam: (id: string) => ["valid-id"],
};
const mockRoute: any = {
  params: {
    ids: ["valid-id"],
  },
};

const mockedNavigate = jest.fn();

jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native");
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockedNavigate,
    }),
  };
});

describe("CustomerAppealScreen", () => {
  let allCampaignConfigs: CampaignConfigsMap;

  beforeAll(() => {
    allCampaignConfigs = {
      campaignA: {
        features: {
          ...defaultFeatures,
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
        <CustomerAppealScreen navigation={mockNavigate} route={mockRoute} />
      </CreateProvidersWrapper>
    );

    expect(queryByText("Toilet Paper")).not.toBeNull();
    expect(queryByText("Soap")).not.toBeNull();
  });

  it("should navigate to the selected reason", async () => {
    expect.assertions(3);
    const { queryByText } = render(
      <CreateProvidersWrapper
        providers={[
          {
            provider: CampaignConfigContextProvider,
            props: { campaignConfig: allCampaignConfigs.campaignA },
          },
        ]}
      >
        <CustomerAppealScreen navigation={mockNavigate} route={mockRoute} />
      </CreateProvidersWrapper>
    );

    const reasonOne = queryByText("Toilet Paper");
    expect(reasonOne).not.toBeNull();

    fireEvent.press(reasonOne!);
    expect(mockedDispatch).toHaveBeenCalledTimes(1);
    expect(mockStackedActionsPush).toHaveBeenCalledWith("CustomerQuotaProxy", {
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
    });
  });
});
