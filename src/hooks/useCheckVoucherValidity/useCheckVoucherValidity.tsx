import { useState, useCallback } from "react";
import { validateVoucherCode } from "../../utils/validateVoucherCode";
import { getVoucherValidation } from "../../services/voucher";
import { Voucher } from "../../types";

export class ScannerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "Error Scanning";
  }
}

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

  const checkValidity: useCheckVoucherValidity["checkValidity"] = useCallback(
    async (serial, vouchers): Promise<void> => {
      setCheckValidityState("CHECKING_VALIDITY");
      const check = async (): Promise<void> => {
        if (serial.length === 0) {
          setError(new Error("No voucher code entered"));
          return;
        }

        try {
          const serialArr = vouchers.map(voucher => voucher.serial);
          validateVoucherCode(serial, serialArr);
        } catch (e) {
          setError(new ScannerError(e.message));
          return;
        }
        //Send to backend to check if valid
        try {
          const validityResponse = await getVoucherValidation(
            serial,
            authKey,
            endpoint
          );
          setValidityResult(validityResponse);
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
