import { useCallback, useContext, useEffect, useState } from "react";
import { CampaignConfigContext } from "../../../context/campaignConfig";
import { getGovWalletBalance } from "../../../services/govwallet/balance";

export type GovWalletBalanceState = "DEFAULT" | "ELIGIBLE" | "INELIGIBLE";

export type GovWalletBalanceHook = {
  govWalletBalanceState: GovWalletBalanceState;
  govWalletBalanceInCents: number;
  govWalletBalanceError?: Error;
  updateGovWalletBalance: () => void;
  clearGovWalletBalanceError: () => void;
};

export class GovWalletBalanceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GovWalletBalanceError";
  }
}

/**
 * A React Hook that checks the GovWallet balance of specified IDs.
 *
 * Note that this hook only works if `checkGovWalletBalance` is set to `true` in `features`.
 *
 * @param ids An array of customer IDs
 * @param authKey Authentication key used to call backend APIs
 * @param endpoint Endpoint of backend APIs
 * @returns React Hook that checks GovWallet balance
 */
export const useGovWalletBalance = (
  ids: string[],
  authKey: string,
  endpoint: string
): GovWalletBalanceHook => {
  const { features } = useContext(CampaignConfigContext);
  const [govWalletBalanceState, setGovWalletBalanceState] =
    useState<GovWalletBalanceState>("DEFAULT");
  /**
   * Balance is defined with default `0` since it will never be
   * `undefined` when used.
   */
  const [govWalletBalanceInCents, setGovWalletBalanceInCents] =
    useState<number>(0);
  const [govWalletBalanceError, setGovWalletBalanceError] =
    useState<GovWalletBalanceError>();

  const clearGovWalletBalanceError = useCallback(
    (): void => setGovWalletBalanceError(undefined),
    []
  );

  const updateGovWalletBalance: GovWalletBalanceHook["updateGovWalletBalance"] =
    useCallback(() => {
      const update = async (): Promise<void> => {
        try {
          setGovWalletBalanceInCents(0);

          const getBalancePromises = ids.flatMap((id) =>
            getGovWalletBalance(id, authKey, endpoint)
          );

          const results = await Promise.all(getBalancePromises);

          // We only check the activation status of the first account
          const areAllAccountsActivated = results.every(
            ({ accountDetails }) =>
              accountDetails[0].activationStatus === "ACTIVATED"
          );

          // We only check the eligibility of the balance of the first account
          const areAllBalancesEligible = results.every(
            // Check if balance is strictly equals to 10000 cents
            ({ accountDetails }) => accountDetails[0].balance === 10000
          );

          // We only retrieve the balance of the first account
          setGovWalletBalanceInCents(results[0].accountDetails[0].balance);

          if (!areAllAccountsActivated) {
            setGovWalletBalanceError(
              new GovWalletBalanceError(
                "Eligible identity's account has been deactivated. Inform your in-charge about this issue."
              )
            );
            setGovWalletBalanceState("INELIGIBLE");
          } else if (!areAllBalancesEligible) {
            setGovWalletBalanceState("INELIGIBLE");
          } else {
            setGovWalletBalanceState("ELIGIBLE");
          }
        } catch (e: unknown) {
          const error = e as Error;
          setGovWalletBalanceError(error);
        }
      };

      update();
    }, [ids, authKey, endpoint]);

  useEffect(() => {
    if (features?.checkGovWalletBalance) {
      updateGovWalletBalance();
    }
  }, [features, updateGovWalletBalance]);

  return {
    govWalletBalanceState,
    govWalletBalanceError,
    updateGovWalletBalance,
    clearGovWalletBalanceError,
    govWalletBalanceInCents,
  };
};
