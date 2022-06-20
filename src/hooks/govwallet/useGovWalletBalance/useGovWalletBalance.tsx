import { isEqual } from "lodash";
import { useCallback, useContext, useEffect, useState } from "react";
import { CampaignConfigContext } from "../../../context/campaignConfig";
import { getGovWalletBalance } from "../../../services/govwallet/balance";
import { usePrevious } from "../../usePrevious";

export type GovWalletBalanceState = "DEFAULT" | "SUFFICIENT" | "INSUFFICIENT";

export type GovWalletBalanceHook = {
  govWalletBalanceState: GovWalletBalanceState;
  govWalletBalanceError?: Error;
  updateGovWalletBalance: () => void;
};

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
  const prevIds = usePrevious(ids);
  const [govWalletBalanceState, setGovWalletBalanceState] =
    useState<GovWalletBalanceState>("DEFAULT");
  const [govWalletBalanceError, setGovWalletBalanceError] = useState<Error>();

  const updateGovWalletBalance: GovWalletBalanceHook["updateGovWalletBalance"] =
    useCallback(() => {
      const update = async (): Promise<void> => {
        try {
          const getBalancePromises = ids.flatMap((id) =>
            getGovWalletBalance(id, authKey, endpoint)
          );

          const results = await Promise.all(getBalancePromises);

          // We only retrieve the balance of the first account
          const areAllBalancesSufficient = results.every(
            // Check if balance is equals to 10000 cents
            ({ accountDetails }) => accountDetails[0].balance >= 10000
          );

          if (!areAllBalancesSufficient) {
            setGovWalletBalanceState("INSUFFICIENT");
          } else {
            setGovWalletBalanceState("SUFFICIENT");
          }
        } catch (e: unknown) {
          const error = e as Error;
          setGovWalletBalanceError(error);
        }
      };

      update();
    }, [ids, authKey, endpoint]);

  useEffect(() => {
    if (features?.checkGovWalletBalance && !isEqual(prevIds, ids)) {
      updateGovWalletBalance();
    }
  }, [features, prevIds, ids, updateGovWalletBalance]);

  return {
    govWalletBalanceState,
    govWalletBalanceError,
    updateGovWalletBalance,
  };
};
