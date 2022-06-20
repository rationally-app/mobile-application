import { GovWalletBalance } from "../../../types";
import { IS_MOCK } from "../../../config";
import {
  fetchWithValidator,
  NetworkError,
  SessionError,
  ValidationError,
} from "../../helpers";
import { Sentry } from "../../../utils/errorTracking";

export class GovWalletBalanceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GovWalletBalanceError";
  }
}

const mockGetGovWalletBalance = async (
  id: string,
  _authKey: string,
  _endpoint: string
): Promise<GovWalletBalance> => {
  // Error case
  if (id === "S0000000J") throw new Error("Something broke");

  return {
    customerId: id, // This can also be hashed
    accountDetails: [
      {
        accountId: id,
        created: "1970-01-01T00:00:00.000+08:00",
        modified: "1970-01-01T00:00:00.000+08:00",
        entity: "Customer",
        accountType: "NORMAL",
        category: "credits",
        campaign: "campaign",
        activationStatus: "ACTIVATED",
        balance: 10000,
      },
    ],
  };
};

const liveGetGovWalletBalance = async (
  id: string,
  authKey: string,
  endpoint: string
): Promise<GovWalletBalance> => {
  let response: GovWalletBalance;

  if (id.length <= 0) {
    throw new GovWalletBalanceError("No ID was provided");
  }

  try {
    response = await fetchWithValidator(
      GovWalletBalance,
      `${endpoint}/govwallet/v2/customer/account/get`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authKey,
        },
        body: JSON.stringify({
          id,
        }),
      }
    );

    return response;
  } catch (e: unknown) {
    const error = e as Error;

    if (error instanceof NetworkError || error instanceof SessionError) {
      throw error;
    } else if (error instanceof ValidationError) {
      Sentry.captureException(error);
    }

    throw new GovWalletBalanceError(error.message);
  }
};

export const getGovWalletBalance = IS_MOCK
  ? mockGetGovWalletBalance
  : liveGetGovWalletBalance;
