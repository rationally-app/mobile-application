/* eslint-disable react/display-name */
import {
  render,
  cleanup,
  fireEvent,
  waitFor,
} from "@testing-library/react-native";
import React, { FunctionComponent } from "react";
import { CustomerQuotaScreen } from "./CustomerQuotaScreen";
import { CampaignPolicy, Quota } from "../../types";
import { CampaignConfigsMap } from "../../context/campaignConfigsStore";
import { CampaignConfigContextProvider } from "../../context/campaignConfig";
import { ProductContextProvider } from "../../context/products";
import * as useCartHook from "../../hooks/useCart/useCart";
import * as useQuotaHook from "../../hooks/useQuota/useQuota";
import * as usePastTransactionHook from "../../hooks/usePastTransaction/usePastTransaction";
import { Sentry } from "../../utils/errorTracking";
import { defaultFeatures } from "../../test/helpers/defaults";
import { CreateProvidersWrapper } from "../../test/helpers/providers";
import "../../common/i18n/i18nMock";

jest.mock("../../utils/errorTracking");
const mockCaptureException = jest.fn();
(Sentry.captureException as jest.Mock).mockImplementation(mockCaptureException);

const mockNavigate: any = {
  navigate: jest.fn(),
  goBack: () => null,
};

jest.mock("react-navigation", () => ({
  withNavigation: (Component: FunctionComponent) => (props: any) => (
    <Component navigation={mockNavigate} {...props} />
  ),
  withNavigationFocus: (Component: FunctionComponent) => (props: any) => (
    <Component navigation={mockNavigate} {...props} />
  ),
}));

const mockProduct: CampaignPolicy[] = [
  {
    category: "toilet-paper",
    name: "🧻 Toilet Paper",
    description: "1 ply / 2 ply / 3 ply",
    order: 1,
    quantity: {
      period: 7,
      limit: 2,
      unit: {
        type: "POSTFIX",
        label: " pack(s)",
      },
    },
  },
  {
    category: "instant-noodles",
    name: "🍜 Instant Noodles",
    description: "Indomee",
    order: 2,
    quantity: {
      period: 30,
      limit: 1,
      unit: {
        type: "POSTFIX",
        label: " pack(s)",
      },
    },
  },
  {
    category: "chocolate",
    name: "🍫 Chocolate",
    description: "Dark / White / Assorted",
    order: 3,
    quantity: {
      period: 14,
      limit: 30,
      step: 5,
      unit: {
        type: "PREFIX",
        label: "$",
      },
    },
  },
  {
    category: "vouchers",
    name: "Funfair Vouchers",
    order: 4,
    quantity: { period: 1, limit: 1, default: 1 },
    identifiers: [
      {
        label: "Voucher",
        textInput: { visible: true, disabled: false, type: "STRING" },
        scanButton: {
          visible: true,
          disabled: false,
          type: "BARCODE",
          text: "Scan",
        },
      },
      {
        label: "Token",
        textInput: { visible: true, disabled: true, type: "STRING" },
        scanButton: {
          visible: true,
          disabled: false,
          type: "QR",
          text: "Scan",
        },
      },
    ],
  },
];

const mockQuotaResponse: Quota = {
  globalQuota: [
    { category: "toilet-paper", quantity: 0 },
    {
      category: "instant-noodles",
      quantity: 1,
    },
    {
      category: "chocolate",
      quantity: 30,
    },
    {
      category: "vouchers",
      quantity: 1,
    },
  ],
  localQuota: [
    { category: "toilet-paper", quantity: Number.MAX_SAFE_INTEGER },
    {
      category: "instant-noodles",
      quantity: Number.MAX_SAFE_INTEGER,
    },
    {
      category: "chocolate",
      quantity: Number.MAX_SAFE_INTEGER,
    },
    {
      category: "vouchers",
      quantity: Number.MAX_SAFE_INTEGER,
    },
  ],
  remainingQuota: [
    { category: "toilet-paper", quantity: 0 },
    {
      category: "instant-noodles",
      quantity: 1,
    },
    {
      category: "chocolate",
      quantity: 30,
    },
    {
      category: "vouchers",
      quantity: 1,
    },
  ],
};

const mockCart: useCartHook.CartItem[] = [
  {
    category: "toilet-paper",
    descriptionAlert: undefined,
    identifierInputs: [],
    maxQuantity: 0,
    quantity: 0,
  },
  {
    category: "instant-noodles",
    descriptionAlert: undefined,
    identifierInputs: [],
    maxQuantity: 1,
    quantity: 0,
  },
  {
    category: "chocolate",
    descriptionAlert: undefined,
    identifierInputs: [],
    maxQuantity: 30,
    quantity: 0,
  },
  {
    category: "vouchers",
    descriptionAlert: undefined,
    identifierInputs: [
      {
        label: "Phone number",
        textInputType: "PHONE_NUMBER",
        value: "+65",
      },
    ],
    maxQuantity: 1,
    quantity: 1,
  },
];

const mockUseCart = jest.spyOn(useCartHook, "useCart");
const mockUseQuota = jest.spyOn(useQuotaHook, "useQuota");
const mockUsePastTransaction = jest.spyOn(
  usePastTransactionHook,
  "usePastTransaction"
);

describe("CustomerQuotaScreen", () => {
  let allCampaignConfigs: CampaignConfigsMap;

  beforeAll(() => {
    allCampaignConfigs = {
      campaignA: {
        features: {
          ...defaultFeatures,
          campaignName: "Some Campaign Name",
        },
        policies: mockProduct,
        c13n: {},
      },
    };
  });

  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
  });

  describe("should render the screen correctly", () => {
    it("when cartState is DEFAULT", async () => {
      expect.assertions(7);

      const mockCheckoutCart = jest.fn();
      mockUseCart.mockReturnValue({
        cartState: "DEFAULT",
        cart: mockCart,
        emptyCart: () => null,
        updateCart: () => null,
        checkoutCart: mockCheckoutCart,
        cartError: undefined,
        clearCartError: () => null,
      });
      mockUseQuota.mockReturnValue({
        quotaResponse: mockQuotaResponse,
        allQuotaResponse: mockQuotaResponse,
        quotaState: "DEFAULT",
        quotaError: undefined,
        updateQuota: () => null,
        clearQuotaError: () => null,
      });

      const { queryByText, queryByTestId } = render(
        <CreateProvidersWrapper
          providers={[
            {
              provider: CampaignConfigContextProvider,
              props: { campaignConfig: allCampaignConfigs.campaignA },
            },
            {
              provider: ProductContextProvider,
              props: { products: mockProduct },
            },
          ]}
        >
          <CustomerQuotaScreen
            navigation={mockNavigate}
            navIds={["valid-id"]}
          />
        </CreateProvidersWrapper>
      );

      const checkoutButton = queryByTestId("items-selection-checkout-button");
      expect(checkoutButton).not.toBeNull();

      expect(queryByText("valid-id")).not.toBeNull();
      expect(queryByText("🧻 Toilet Paper")).not.toBeNull();
      expect(queryByText("🍜 Instant Noodles")).not.toBeNull();
      expect(queryByText("🍫 Chocolate")).not.toBeNull();
      expect(queryByText("Funfair Vouchers")).not.toBeNull();

      fireEvent.press(checkoutButton!);
      await waitFor(() => {
        expect(mockCheckoutCart).toHaveBeenCalledTimes(1);
      });
    });

    it("when cartState is PURCHASED", async () => {
      expect.assertions(6);

      mockUseCart.mockReturnValue({
        cartState: "PURCHASED",
        cart: mockCart,
        emptyCart: () => null,
        updateCart: () => null,
        checkoutCart: () => null,
        cartError: undefined,
        clearCartError: () => null,
      });
      mockUseQuota.mockReturnValue({
        quotaResponse: mockQuotaResponse,
        allQuotaResponse: mockQuotaResponse,
        quotaState: "DEFAULT",
        quotaError: undefined,
        updateQuota: () => null,
        clearQuotaError: () => null,
      });
      mockUsePastTransaction.mockReturnValue({
        pastTransactionsResult: [
          {
            category: "toilet-paper",
            quantity: 1,
            transactionTime: new Date(0),
          },
        ],
        loading: false,
        error: null,
      });

      const { queryByText, queryByTestId } = render(
        <CreateProvidersWrapper
          providers={[
            {
              provider: CampaignConfigContextProvider,
              props: { campaignConfig: allCampaignConfigs.campaignA },
            },
            {
              provider: ProductContextProvider,
              props: { products: mockProduct },
            },
          ]}
        >
          <CustomerQuotaScreen
            navigation={mockNavigate}
            navIds={["valid-id"]}
          />
        </CreateProvidersWrapper>
      );

      expect(queryByText("valid-id")).not.toBeNull();
      expect(queryByTestId("checkout-success-title")).not.toBeNull();
      expect(queryByText("Item(s) redeemed:")).not.toBeNull();
      expect(queryByText("1 Jan 1970, 7:30AM")).not.toBeNull();
      expect(queryByText("🧻 Toilet Paper")).not.toBeNull();
      expect(queryByText("1 pack(s)")).not.toBeNull();
    });

    it("when cartState is UNSUCCESSFUL", async () => {
      expect.assertions(6);

      mockUseCart.mockReturnValue({
        cartState: "UNSUCCESSFUL",
        cart: mockCart,
        emptyCart: () => null,
        updateCart: () => null,
        checkoutCart: () => null,
        cartError: undefined,
        clearCartError: () => null,
      });
      mockUseQuota.mockReturnValue({
        quotaResponse: mockQuotaResponse,
        allQuotaResponse: mockQuotaResponse,
        quotaState: "DEFAULT",
        quotaError: undefined,
        updateQuota: () => null,
        clearQuotaError: () => null,
      });
      mockUsePastTransaction.mockReturnValue({
        pastTransactionsResult: [
          {
            category: "toilet-paper",
            quantity: 1,
            transactionTime: new Date(0),
          },
        ],
        loading: false,
        error: null,
      });

      const { queryByText, queryByTestId } = render(
        <CreateProvidersWrapper
          providers={[
            {
              provider: CampaignConfigContextProvider,
              props: { campaignConfig: allCampaignConfigs.campaignA },
            },
            {
              provider: ProductContextProvider,
              props: { products: mockProduct },
            },
          ]}
        >
          <CustomerQuotaScreen
            navigation={mockNavigate}
            navIds={["valid-id"]}
          />
        </CreateProvidersWrapper>
      );

      expect(queryByText("valid-id")).not.toBeNull();
      expect(queryByTestId("checkout-unsuccessful-title")).not.toBeNull();
      expect(
        queryByText("Item(s) redeemed previously that is eligible for return:")
      ).not.toBeNull();
      expect(queryByText("1 Jan 1970, 7:30AM")).not.toBeNull();
      expect(queryByText("🧻 Toilet Paper")).not.toBeNull();
      expect(queryByText("1 pack(s)")).not.toBeNull();
    });

    it("when quotaState is NO_QUOTA", async () => {
      expect.assertions(2);

      mockUseCart.mockReturnValue({
        cartState: "DEFAULT",
        cart: mockCart,
        emptyCart: () => null,
        updateCart: () => null,
        checkoutCart: () => null,
        cartError: undefined,
        clearCartError: () => null,
      });
      mockUseQuota.mockReturnValue({
        quotaResponse: mockQuotaResponse,
        allQuotaResponse: mockQuotaResponse,
        quotaState: "NO_QUOTA",
        quotaError: undefined,
        updateQuota: () => null,
        clearQuotaError: () => null,
      });
      mockUsePastTransaction.mockReturnValue({
        pastTransactionsResult: [],
        loading: true,
        error: null,
      });

      const { queryByText, queryByTestId } = render(
        <CreateProvidersWrapper
          providers={[
            {
              provider: CampaignConfigContextProvider,
              props: { campaignConfig: allCampaignConfigs.campaignA },
            },
            {
              provider: ProductContextProvider,
              props: { products: mockProduct },
            },
          ]}
        >
          <CustomerQuotaScreen
            navigation={mockNavigate}
            navIds={["valid-id"]}
          />
        </CreateProvidersWrapper>
      );

      expect(queryByText("valid-id")).not.toBeNull();
      expect(queryByTestId("no-quota-title")).not.toBeNull();
    });

    it("when quotaState is NOT_ELIGIBLE", async () => {
      expect.assertions(3);

      mockUseCart.mockReturnValue({
        cartState: "DEFAULT",
        cart: mockCart,
        emptyCart: () => null,
        updateCart: () => null,
        checkoutCart: () => null,
        cartError: undefined,
        clearCartError: () => null,
      });
      mockUseQuota.mockReturnValue({
        quotaResponse: mockQuotaResponse,
        allQuotaResponse: mockQuotaResponse,
        quotaState: "NOT_ELIGIBLE",
        quotaError: undefined,
        updateQuota: () => null,
        clearQuotaError: () => null,
      });
      mockUsePastTransaction.mockReturnValue({
        pastTransactionsResult: [],
        loading: true,
        error: null,
      });

      const { queryByText, queryByTestId } = render(
        <CreateProvidersWrapper
          providers={[
            {
              provider: CampaignConfigContextProvider,
              props: { campaignConfig: allCampaignConfigs.campaignA },
            },
            {
              provider: ProductContextProvider,
              props: { products: mockProduct },
            },
          ]}
        >
          <CustomerQuotaScreen
            navigation={mockNavigate}
            navIds={["valid-id"]}
          />
        </CreateProvidersWrapper>
      );

      expect(queryByText("valid-id")).not.toBeNull();
      expect(queryByTestId("not-eligible-title")).not.toBeNull();
      expect(
        queryByText(
          "Not eligible to collect any item. Contact your in-charge to find out about the appeal guidelines."
        )
      ).not.toBeNull();
    });

    it("when quotaState is FETCHING_QUOTA", async () => {
      expect.assertions(1);

      mockUseCart.mockReturnValue({
        cartState: "DEFAULT",
        cart: mockCart,
        emptyCart: () => null,
        updateCart: () => null,
        checkoutCart: () => null,
        cartError: undefined,
        clearCartError: () => null,
      });
      mockUseQuota.mockReturnValue({
        quotaResponse: mockQuotaResponse,
        allQuotaResponse: mockQuotaResponse,
        quotaState: "FETCHING_QUOTA",
        quotaError: undefined,
        updateQuota: () => null,
        clearQuotaError: () => null,
      });
      mockUsePastTransaction.mockReturnValue({
        pastTransactionsResult: [],
        loading: true,
        error: null,
      });

      const { queryByText } = render(
        <CreateProvidersWrapper
          providers={[
            {
              provider: CampaignConfigContextProvider,
              props: { campaignConfig: allCampaignConfigs.campaignA },
            },
            {
              provider: ProductContextProvider,
              props: { products: mockProduct },
            },
          ]}
        >
          <CustomerQuotaScreen
            navigation={mockNavigate}
            navIds={["valid-id"]}
          />
        </CreateProvidersWrapper>
      );

      expect(queryByText("Checking...")).not.toBeNull();
    });
  });
});
