import { getGovWalletBalance, GovWalletBalanceError } from ".";
import { GovWalletAccountDetail } from "../../../hooks/govwallet/useGovWalletBalance/useGovWalletBalance";
import { GovWalletBalance } from "../../../types";
import { Sentry } from "../../../utils/errorTracking";
import { NetworkError, SessionError } from "../../helpers";

const mockFetch = jest.fn();
jest.spyOn(global, "fetch").mockImplementation(mockFetch);

jest.mock("../../../utils/errorTracking");
const mockCaptureException = jest.fn();
(Sentry.captureException as jest.Mock).mockImplementation(mockCaptureException);

const customerId = "S00000000J";
const authKey = "KEY";
const endpoint = "https://myendpoint.com";

const accountDetailWithSufficientBalance: GovWalletAccountDetail = {
  accountId: customerId,
  created: "1970-01-01T00:00:00.000+08:00",
  modified: "1970-01-01T00:00:00.000+08:00",
  entity: "Customer",
  accountType: "NORMAL",
  category: "credits",
  campaign: "campaign",
  activationStatus: "ACTIVATED",
  balance: 10000,
};

const response: GovWalletBalance = {
  customerId,
  accountDetails: [accountDetailWithSufficientBalance],
};

describe("Getting GovWallet Balance", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("should return the balance of an ID", async () => {
    expect.assertions(1);

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(response),
    });

    const balance = await getGovWalletBalance(customerId, authKey, endpoint);

    expect(balance).toStrictEqual(response);
  });

  it("should throw error if no ID is provided", async () => {
    expect.assertions(1);

    await expect(getGovWalletBalance("", authKey, endpoint)).rejects.toThrow(
      GovWalletBalanceError
    );
  });

  it("should throw NetworkError if NetworkError is thrown", async () => {
    expect.assertions(1);

    mockFetch.mockRejectedValueOnce(new NetworkError("Network error"));

    await expect(
      getGovWalletBalance(customerId, authKey, endpoint)
    ).rejects.toThrow(NetworkError);
  });

  it("should throw SessionError if SessionError is thrown", async () => {
    expect.assertions(1);

    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () =>
        Promise.resolve({ message: "Invalid authentication token provided" }),
    });

    await expect(
      getGovWalletBalance(customerId, authKey, endpoint)
    ).rejects.toThrow(SessionError);
  });

  it("should throw error if response is malformed", async () => {
    expect.assertions(2);

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          invalidProperty: true,
        }),
    });

    await expect(
      getGovWalletBalance(customerId, authKey, endpoint)
    ).rejects.toThrow(GovWalletBalanceError);

    expect(mockCaptureException).toHaveBeenCalledTimes(1);
  });

  it("should throw error with message if unknown error is thrown", async () => {
    expect.assertions(2);

    mockFetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ message: "Something unexpected occurred" }),
    });

    await expect(
      getGovWalletBalance(customerId, authKey, endpoint)
    ).rejects.toThrow(GovWalletBalanceError);

    await expect(
      getGovWalletBalance(customerId, authKey, endpoint)
    ).rejects.toThrow("Something unexpected occurred");
  });
});
