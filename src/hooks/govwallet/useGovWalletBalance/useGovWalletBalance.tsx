import { useCallback, useContext, useEffect, useState } from "react";
import { CampaignConfigContext } from "../../../context/campaignConfig";
import { getGovWalletBalance } from "../../../services/govwallet/balance";
import { ErrorWithCodes } from "../../../services/helpers";
import { formatGovWalletDateToSallyDateFormat } from "../../../utils/dateTimeFormatter";

export type GovWalletBalanceState =
  | "DEFAULT"
  | "FETCHING_BALANCE"
  | "ELIGIBLE"
  | "INELIGIBLE";

export type GovWalletBalanceHook = {
  govWalletBalanceState: GovWalletBalanceState;
  govWalletBalanceInCents: number;
  lastModifiedDate: string;
  govWalletBalanceError?: Error;
  updateGovWalletBalance: () => void;
  clearGovWalletBalanceError: () => void;
};

/**
 * A React Hook that checks the GovWallet balance of specified IDs.
 *
 * Note that this hook only works if `isPayNowTransaction` is set to `true` in `features`.
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
  const [govWalletBalanceError, setGovWalletBalanceError] = useState<Error>();
  const [lastModifiedDate, setLastModifiedDate] = useState<string>("");

  const clearGovWalletBalanceError = useCallback(
    (): void => setGovWalletBalanceError(undefined),
    []
  );

  const updateGovWalletBalance: GovWalletBalanceHook["updateGovWalletBalance"] =
    useCallback(() => {
      const update = async (): Promise<void> => {
        try {
          setGovWalletBalanceInCents(0);
          setLastModifiedDate("");
          setGovWalletBalanceState("FETCHING_BALANCE");

          const getBalancePromises = ids.flatMap((id) =>
            getGovWalletBalance(id, authKey, endpoint)
          );

          const results = await Promise.all(getBalancePromises);

          // We only check the activation status of the first account
          const areAllAccountsActivated = results.every(
            ({ accountDetails }) =>
              accountDetails[0].activationStatus === "ACTIVATED"
          );

          // if govwalletExactBalanceValue == -1 or undefined, dont check exact value. Will catch on GW side if insufficient
          const isCheckForExactBalance =
            (features?.govwalletExactBalanceValue ?? -1) >= 0;

          // We only check the eligibility of the balance of the first account if isCheckForExactBalance is true
          const areAllBalancesEligible = isCheckForExactBalance
            ? results.every(
                ({ accountDetails }) =>
                  accountDetails[0].balance ===
                  features?.govwalletExactBalanceValue
              )
            : true;

          // We only retrieve the balance of the first account
          setGovWalletBalanceInCents(results[0].accountDetails[0].balance);

          setLastModifiedDate(
            formatGovWalletDateToSallyDateFormat(
              results[0].accountDetails[0].modified
            )
          );

          if (!areAllAccountsActivated) {
            setGovWalletBalanceError(
              new ErrorWithCodes(
                "Eligible identity's account has been deactivated. Inform your in-charge about this issue.",
                400
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
          setGovWalletBalanceState("DEFAULT");
          setGovWalletBalanceError(error);
        }
      };

      update();
    }, [ids, authKey, endpoint, features?.govwalletExactBalanceValue]);

  useEffect(() => {
    if (features?.isPayNowTransaction) {
      updateGovWalletBalance();
    }
  }, [features, updateGovWalletBalance]);

  return {
    govWalletBalanceState,
    govWalletBalanceError,
    updateGovWalletBalance,
    clearGovWalletBalanceError,
    govWalletBalanceInCents,
    lastModifiedDate,
  };
};
