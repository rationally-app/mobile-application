import { GovWalletBalance } from "../../../types";
import { IS_MOCK } from "../../../config";
import {
  ErrorWithCodes,
  fetchWithValidator,
  NetworkError,
  SessionError,
  ValidationError,
} from "../../helpers";
import { Sentry } from "../../../utils/errorTracking";
import { defaultFeatures } from "../../../test/helpers/defaults";

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
        balance: defaultFeatures.govwalletExactBalanceValue ?? 10000,
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
    throw new ErrorWithCodes("No ID was provided", 400);
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
      },
      true
    );

    return response;
  } catch (e: unknown) {
    const error = e as Error;

    if (error instanceof NetworkError || error instanceof SessionError) {
      throw error;
    } else if (error instanceof ValidationError) {
      Sentry.captureException(error);
    }

    throw e;
  }
};

export const getGovWalletBalance = IS_MOCK
  ? mockGetGovWalletBalance
  : liveGetGovWalletBalance;
