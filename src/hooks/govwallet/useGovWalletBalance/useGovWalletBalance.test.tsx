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
import { ErrorWithCodes, NetworkError } from "../../../services/helpers";

jest.mock("../../../services/govwallet/balance");
const mockGetGovWalletBalance = getGovWalletBalance as jest.Mock;

const key = "KEY";
const endpoint = "https://myendpoint.com";

const testCampaignConfig: CampaignConfig = {
  ...defaultCampaignConfig,
  features: {
    ...defaultFeatures,
    isPayNowTransaction: true,
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

describe("isPayNowTransaction toggle", () => {
  beforeAll(() => {
    ids = ["S0000000J"];

    mockGetGovWalletBalance.mockResolvedValue({
      accountDetails: [{ activationStatus: "ACTIVATED", balance: 10000 }],
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

    expect(result.current.govWalletBalanceState).toBe("FETCHING_BALANCE");
    await waitForNextUpdate();
    expect(result.current.govWalletBalanceState).toBe("ELIGIBLE");
    expect(mockGetGovWalletBalance).toHaveBeenCalledTimes(1);
  });

  it("should NOT get balance if toggle is false", async () => {
    expect.assertions(2);

    const { result } = renderHook(
      () => useGovWalletBalance(ids, key, endpoint),
      { wrapper: wrapperWithToggleOff }
    );

    expect(result.current.govWalletBalanceState).toBe("DEFAULT");
    expect(mockGetGovWalletBalance).toHaveBeenCalledTimes(0);
  });
});

describe("govWalletBalanceState states", () => {
  let activationStatus: string;

  beforeAll(() => {
    ids = ["S0000000J"];
    activationStatus = "ACTIVATED";
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 'ELIGIBLE' if balance is strictly equal to 10000 cents", async () => {
    expect.assertions(3);

    mockGetGovWalletBalance.mockResolvedValueOnce({
      accountDetails: [{ activationStatus, balance: 10000 }],
    });

    const { result, waitForNextUpdate } = renderHook(
      () => useGovWalletBalance(ids, key, endpoint),
      { wrapper }
    );

    expect(result.current.govWalletBalanceState).toBe("FETCHING_BALANCE");
    await waitForNextUpdate();
    expect(result.current.govWalletBalanceState).toBe("ELIGIBLE");
    expect(mockGetGovWalletBalance).toHaveBeenCalledTimes(1);
  });

  it("should return 'INELIGIBLE' if balance is more than 10000 cents", async () => {
    expect.assertions(3);

    mockGetGovWalletBalance.mockResolvedValueOnce({
      accountDetails: [{ activationStatus, balance: 10001 }],
    });

    const { result, waitForNextUpdate } = renderHook(
      () => useGovWalletBalance(ids, key, endpoint),
      { wrapper }
    );

    expect(result.current.govWalletBalanceState).toBe("FETCHING_BALANCE");
    await waitForNextUpdate();
    expect(result.current.govWalletBalanceState).toBe("INELIGIBLE");
    expect(mockGetGovWalletBalance).toHaveBeenCalledTimes(1);
  });

  it("should return 'INELIGIBLE' if balance is less than 10000 cents", async () => {
    expect.assertions(3);

    mockGetGovWalletBalance.mockResolvedValueOnce({
      accountDetails: [{ activationStatus, balance: 9999 }],
    });

    const { result, waitForNextUpdate } = renderHook(
      () => useGovWalletBalance(ids, key, endpoint),
      { wrapper }
    );

    expect(result.current.govWalletBalanceState).toBe("FETCHING_BALANCE");
    await waitForNextUpdate();
    expect(result.current.govWalletBalanceState).toBe("INELIGIBLE");
    expect(mockGetGovWalletBalance).toHaveBeenCalledTimes(1);
  });

  it("should return error if account activation status is 'DEACTIVATED'", async () => {
    expect.assertions(4);

    mockGetGovWalletBalance.mockResolvedValueOnce({
      accountDetails: [{ activationStatus: "DEACTIVATED", balance: 10000 }],
    });

    const { result, waitForNextUpdate } = renderHook(
      () => useGovWalletBalance(ids, key, endpoint),
      { wrapper }
    );

    expect(result.current.govWalletBalanceState).toBe("FETCHING_BALANCE");
    await waitForNextUpdate();
    expect(result.current.govWalletBalanceState).toBe("INELIGIBLE");
    expect(result.current.govWalletBalanceError).toStrictEqual(
      new ErrorWithCodes(
        "Eligible identity's account has been deactivated. Inform your in-charge about this issue.",
        400
      )
    );
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

    expect(result.current.govWalletBalanceState).toBe("FETCHING_BALANCE");
    await waitForNextUpdate();
    expect(result.current.govWalletBalanceState).toBe("DEFAULT");
    expect(mockGetGovWalletBalance).toHaveBeenCalledTimes(1);
    expect(result.current.govWalletBalanceError).toStrictEqual(
      new NetworkError("Network error")
    );
  });

  it("should return 'DEFAULT' and error if a HTTP 400 error occurred", async () => {
    expect.assertions(4);

    mockGetGovWalletBalance.mockRejectedValue(
      new ErrorWithCodes("Invalid customerId", 400, "F00B4R")
    );

    const { result, waitForNextUpdate } = renderHook(
      () => useGovWalletBalance(ids, key, endpoint),
      { wrapper }
    );

    expect(result.current.govWalletBalanceState).toBe("FETCHING_BALANCE");
    await waitForNextUpdate();
    expect(result.current.govWalletBalanceState).toBe("DEFAULT");
    expect(mockGetGovWalletBalance).toHaveBeenCalledTimes(1);
    expect(result.current.govWalletBalanceError).toStrictEqual(
      new ErrorWithCodes("Invalid customerId", 400, "F00B4R")
    );
  });

  it("should return 'DEFAULT' and error if a HTTP 500 error occurred", async () => {
    expect.assertions(4);

    mockGetGovWalletBalance.mockRejectedValue(new ErrorWithCodes("", 500));

    const { result, waitForNextUpdate } = renderHook(
      () => useGovWalletBalance(ids, key, endpoint),
      { wrapper }
    );

    expect(result.current.govWalletBalanceState).toBe("FETCHING_BALANCE");
    await waitForNextUpdate();
    expect(result.current.govWalletBalanceState).toBe("DEFAULT");
    expect(mockGetGovWalletBalance).toHaveBeenCalledTimes(1);
    expect(result.current.govWalletBalanceError).toStrictEqual(
      new ErrorWithCodes("", 500)
    );
  });
});
