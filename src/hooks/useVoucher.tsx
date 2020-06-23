import { useState, useCallback } from "react";
import { validateMerchantCode } from "../utils/validateMerchantCode";

export type Voucher = {
  serial: string;
  denomination: number;
};

type VoucherState = "DEFAULT" | "CONSUMING_VOUCHER" | "RESULT_RETURNED";

export type VoucherHook = {
  voucherState: VoucherState;
  vouchers: Voucher[];
  addVoucher: (voucher: Voucher) => void;
  removeVoucher: (serial: string) => void;
  checkoutMerchantCode: (merchantCode: string) => void;
  error?: Error;
  clearError: () => void;
  resetState: () => void;
};

export const useVoucher = (): VoucherHook => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [voucherState, setVoucherState] = useState<VoucherState>("DEFAULT");
  const [error, setError] = useState<Error>();

  const resetState = useCallback((): void => {
    setError(undefined);
    setVouchers([]);
  }, []);

  const clearError = useCallback((): void => setError(undefined), []);

  const addVoucher: VoucherHook["addVoucher"] = voucher => {
    setVouchers([...vouchers, voucher]);
  };

  const removeVoucher: VoucherHook["removeVoucher"] = useCallback(
    serial => {
      setVouchers(vouchers.filter(voucher => voucher.serial !== serial));
    },
    [vouchers]
  );

  const checkoutMerchantCode: VoucherHook["checkoutMerchantCode"] = useCallback(
    merchantCode => {
      setVoucherState("CONSUMING_VOUCHER");
      const checkout = async (): Promise<void> => {
        try {
          validateMerchantCode(merchantCode);
        } catch (e) {
          setError(e);
          return;
        }

        try {
          ///TODO: Send to API -> Valid, for now timeout
          await new Promise(res => setTimeout(res, 1000)); // delay 1s
          console.log("Sending to API");
          setVoucherState("RESULT_RETURNED");
        } catch (e) {
          setError(e);
        }
      };

      checkout();
    },
    []
  );

  return {
    voucherState,
    vouchers,
    addVoucher,
    removeVoucher,
    checkoutMerchantCode,
    error,
    clearError,
    resetState
  };
};
