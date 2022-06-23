import { renderHook } from "@testing-library/react-hooks";
import React, { FunctionComponent } from "react";
import { getGovWalletBalance } from "../../../services/govwallet/balance";
import {
  defaultCampaignConfig,
  defaultFeatures,
  defaultProducts,
} from "../../../test/helpers/defaults";
import { CampaignConfig } from "../../../types";
import { useGovWalletBalance } from "./useGovWalletBalance";
import { ProductContextProvider } from "../../../context/products";
import { CampaignConfigContextProvider } from "../../../context/campaignConfig";
import { NetworkError } from "../../../services/helpers";

jest.mock("../../../services/govwallet/balance");
const mockGetGovWalletBalance = getGovWalletBalance as jest.Mock;

const key = "KEY";
const endpoint = "https://myendpoint.com";

const testCampaignConfig: CampaignConfig = {
  ...defaultCampaignConfig,
  features: {
    ...defaultFeatures,
    checkGovWalletBalance: true,
  },
};

const wrapper: FunctionComponent = ({ children }) => (
  <ProductContextProvider products={defaultProducts}>
    <CampaignConfigContextProvider campaignConfig={testCampaignConfig}>
      {children}
    </CampaignConfigContextProvider>
  </ProductContextProvider>
);

const wrapperWithToggleOff: FunctionComponent = ({ children }) => (
  <ProductContextProvider products={defaultProducts}>
    <CampaignConfigContextProvider campaignConfig={defaultCampaignConfig}>
      {children}
    </CampaignConfigContextProvider>
  </ProductContextProvider>
);

let ids: string[];

describe("checkGovWalletBalance toggle", () => {
  beforeAll(() => {
    ids = ["S0000000J"];

    mockGetGovWalletBalance.mockResolvedValue({
      accountDetails: [{ balance: 10000 }],
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should get balance if toggle is true", async () => {
    expect.assertions(3);

    const { result, waitForNextUpdate } = renderHook(
      () => useGovWalletBalance(ids, key, endpoint),
      { wrapper }
    );

    expect(result.current.govWalletBalanceState).toStrictEqual("DEFAULT");
    await waitForNextUpdate();
    expect(result.current.govWalletBalanceState).toStrictEqual("ELIGIBLE");
    expect(mockGetGovWalletBalance).toHaveBeenCalledTimes(1);
  });

  it("should NOT get balance if toggle is false", async () => {
    expect.assertions(2);

    const { result } = renderHook(
      () => useGovWalletBalance(ids, key, endpoint),
      { wrapper: wrapperWithToggleOff }
    );

    expect(result.current.govWalletBalanceState).toStrictEqual("DEFAULT");
    expect(mockGetGovWalletBalance).toHaveBeenCalledTimes(0);
  });
});

describe("govWalletBalanceState states", () => {
  beforeAll(() => {
    ids = ["S0000000J"];
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 'ELIGIBLE' if balance is strictly equal to 10000 cents", async () => {
    expect.assertions(3);

    mockGetGovWalletBalance.mockResolvedValueOnce({
      accountDetails: [{ balance: 10000 }],
    });

    const { result, waitForNextUpdate } = renderHook(
      () => useGovWalletBalance(ids, key, endpoint),
      { wrapper }
    );

    expect(result.current.govWalletBalanceState).toStrictEqual("DEFAULT");
    await waitForNextUpdate();
    expect(result.current.govWalletBalanceState).toStrictEqual("ELIGIBLE");
    expect(mockGetGovWalletBalance).toHaveBeenCalledTimes(1);
  });

  it("should return 'INELIGIBLE' if balance is more than 10000 cents", async () => {
    expect.assertions(3);

    mockGetGovWalletBalance.mockResolvedValueOnce({
      accountDetails: [{ balance: 10001 }],
    });

    const { result, waitForNextUpdate } = renderHook(
      () => useGovWalletBalance(ids, key, endpoint),
      { wrapper }
    );

    expect(result.current.govWalletBalanceState).toStrictEqual("DEFAULT");
    await waitForNextUpdate();
    expect(result.current.govWalletBalanceState).toStrictEqual("INELIGIBLE");
    expect(mockGetGovWalletBalance).toHaveBeenCalledTimes(1);
  });

  it("should return 'INELIGIBLE' if balance is less than 10000 cents", async () => {
    expect.assertions(3);

    mockGetGovWalletBalance.mockResolvedValueOnce({
      accountDetails: [{ balance: 9999 }],
    });

    const { result, waitForNextUpdate } = renderHook(
      () => useGovWalletBalance(ids, key, endpoint),
      { wrapper }
    );

    expect(result.current.govWalletBalanceState).toStrictEqual("DEFAULT");
    await waitForNextUpdate();
    expect(result.current.govWalletBalanceState).toStrictEqual("INELIGIBLE");
    expect(mockGetGovWalletBalance).toHaveBeenCalledTimes(1);
  });

  it("should return 'DEFAULT' and error if an error occurred", async () => {
    expect.assertions(4);

    mockGetGovWalletBalance.mockRejectedValue(
      new NetworkError("Network error")
    );

    const { result, waitForNextUpdate } = renderHook(
      () => useGovWalletBalance(ids, key, endpoint),
      { wrapper }
    );

    expect(result.current.govWalletBalanceState).toStrictEqual("DEFAULT");
    await waitForNextUpdate();
    expect(result.current.govWalletBalanceState).toStrictEqual("DEFAULT");
    expect(mockGetGovWalletBalance).toHaveBeenCalledTimes(1);
    expect(result.current.govWalletBalanceError).toStrictEqual(
      new NetworkError("Network error")
    );
  });
});
