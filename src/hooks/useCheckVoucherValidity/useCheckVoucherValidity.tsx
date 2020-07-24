import { useState, useCallback } from "react";
import { validateVoucherCode } from "../../utils/validateVoucherCode";
import { getQuota } from "../../services/quota";
import { Quota, Voucher } from "../../types";
import { differenceInSeconds, compareDesc } from "date-fns";

export class ScannerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ScanningError";
  }
}

export class InvalidVoucherError extends Error {
  public latestTransactionTime: Date | undefined;
  constructor(message: string, latestTransactionTime: Date | undefined) {
    super(message);
    this.name = "InvalidVoucherError";
    this.latestTransactionTime = latestTransactionTime;
  }

  public getSecondsFromLatestTransaction = (): number => {
    const now = new Date();
    const secondsFromLatestTransaction = this.latestTransactionTime
      ? differenceInSeconds(now, this.latestTransactionTime)
      : -1;
    return secondsFromLatestTransaction;
  };
}

const getLatestTransactionTime = (
  remainingQuota: Quota["remainingQuota"]
): Date | undefined => {
  const sortedQuota = remainingQuota.sort((item1, item2) =>
    compareDesc(item1.transactionTime ?? 0, item2.transactionTime ?? 0)
  );
  const latestTransactionTime = sortedQuota[0]?.transactionTime ?? undefined;
  return latestTransactionTime;
};

type CheckValidityState = "DEFAULT" | "CHECKING_VALIDITY" | "RESULT_RETURNED";

export type useCheckVoucherValidity = {
  checkValidityState: CheckValidityState;
  checkValidity: (serial: string, vouchers: Voucher[]) => void;
  validityResult?: Voucher;
  error?: Error;
  resetValidityState: () => void;
};

export const useCheckVoucherValidity = (
  authKey: string,
  endpoint: string
): useCheckVoucherValidity => {
  const [checkValidityState, setCheckValidityState] = useState<
    CheckValidityState
  >("DEFAULT");
  const [validityResult, setValidityResult] = useState<Voucher>();
  const [error, setError] = useState<Error>();

  const resetValidityState = useCallback((): void => {
    setError(undefined);
    setCheckValidityState("DEFAULT");
  }, []);

  const getVoucherValidity = (response: Quota, serial: string): Voucher => {
    const voucherQuota = response.remainingQuota.filter(
      quota => quota.category === "voucher"
    );
    if (voucherQuota[0].quantity === 0) {
      const latestTransactionTime = getLatestTransactionTime(voucherQuota);
      throw new InvalidVoucherError(
        "Item redeemed previously",
        latestTransactionTime
      );
    }
    return {
      serial,
      denomination: 2
    };
  };

  const checkValidity: useCheckVoucherValidity["checkValidity"] = useCallback(
    async (serial, vouchers): Promise<void> => {
      setCheckValidityState("CHECKING_VALIDITY");
      const check = async (): Promise<void> => {
        if (serial.length === 0) {
          setError(new ScannerError("No voucher code entered"));
          return;
        }

        try {
          const serialArr = vouchers.map(voucher => voucher.serial);
          validateVoucherCode(serial, serialArr);
        } catch (e) {
          setError(new ScannerError(e.message));
          return;
        }
        // Send to backend to check if valid
        try {
          const validityResponse = await getQuota([serial], authKey, endpoint);
          const voucher = getVoucherValidity(validityResponse, serial);
          setValidityResult(voucher);
          setCheckValidityState("RESULT_RETURNED");
        } catch (e) {
          setError(e);
        }
      };
      check();
    },
    [authKey, endpoint]
  );

  return {
    checkValidityState,
    checkValidity,
    validityResult,
    error,
    resetValidityState
  };
};
