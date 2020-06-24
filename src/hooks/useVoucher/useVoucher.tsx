import { useState, useCallback } from "react";
import { validateMerchantCode } from "../../utils/validateMerchantCode";
import { Voucher, PostTransactionResult, Transaction } from "../../types";
import { postTransaction } from "../../services/voucher";

type VoucherState = "DEFAULT" | "CONSUMING_VOUCHER" | "RESULT_RETURNED";

export type VoucherHook = {
  voucherState: VoucherState;
  vouchers: Voucher[];
  addVoucher: (voucher: Voucher) => void;
  removeVoucher: (serial: string) => void;
  checkoutMerchantCode: (merchantCode: string) => void;
  checkoutResult?: PostTransactionResult;
  error?: Error;
  clearError: () => void;
  resetState: () => void;
};

export const useVoucher = (authKey: string, endpoint: string): VoucherHook => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [voucherState, setVoucherState] = useState<VoucherState>("DEFAULT");
  const [checkoutResult, setCheckoutResult] = useState<PostTransactionResult>();
  const [error, setError] = useState<Error>();

  const resetState = useCallback((): void => {
    setError(undefined);
    setCheckoutResult(undefined);
    setVoucherState("DEFAULT");
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

        const transactions: Transaction[] = [
          {
            category: "voucher",
            quantity: vouchers.length,
            identifiers: [
              {
                label: "Merchant Code",
                value: merchantCode
              },
              {
                label: "Redeemed by",
                value: merchantCode
              }
            ]
          }
        ];

        try {
          const transactionResponse = await postTransaction({
            ids: vouchers.map(voucher => voucher.serial),
            key: authKey,
            transactions,
            endpoint
          });
          setCheckoutResult(transactionResponse);
          setVoucherState("RESULT_RETURNED");
        } catch (e) {
          setError(e);
        }
      };

      checkout();
    },
    [authKey, endpoint, vouchers]
  );

  return {
    voucherState,
    vouchers,
    addVoucher,
    removeVoucher,
    checkoutMerchantCode,
    checkoutResult,
    error,
    clearError,
    resetState
  };
};
