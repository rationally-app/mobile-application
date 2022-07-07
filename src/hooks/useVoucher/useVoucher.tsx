import { useState, useCallback, useContext } from "react";
import { validateMerchantCode } from "../../utils/validateMerchantCode";
import { Voucher, PostTransactionResult, Transaction } from "../../types";
import { postTransaction } from "../../services/quota";
import { IdentificationContext } from "../../context/identification";

type CheckoutVouchersState =
  | "DEFAULT"
  | "CONSUMING_VOUCHER"
  | "RESULT_RETURNED";

export type VoucherHook = {
  checkoutVouchersState: CheckoutVouchersState;
  vouchers: Voucher[];
  addVoucher: (voucher: Voucher) => void;
  removeVoucher: (serial: string) => void;
  checkoutVouchers: (merchantCode: string) => void;
  checkoutResult?: PostTransactionResult;
  error?: Error;
  resetState: (keepVouchers?: boolean) => void;
};

export const useVoucher = (authKey: string, endpoint: string): VoucherHook => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [checkoutVouchersState, setCheckoutVouchersState] =
    useState<CheckoutVouchersState>("DEFAULT");
  const [checkoutResult, setCheckoutResult] = useState<PostTransactionResult>();
  const [error, setError] = useState<Error>();
  const { selectedIdType } = useContext(IdentificationContext);

  const resetState = useCallback((keepVouchers = false): void => {
    setError(undefined);
    setCheckoutResult(undefined);
    setCheckoutVouchersState("DEFAULT");
    if (!keepVouchers) {
      setVouchers([]);
    }
  }, []);

  const addVoucher: VoucherHook["addVoucher"] = (voucher) => {
    setVouchers([...vouchers, voucher]);
  };

  const removeVoucher: VoucherHook["removeVoucher"] = useCallback(
    (serial) => {
      setVouchers(vouchers.filter((voucher) => voucher.serial !== serial));
    },
    [vouchers]
  );

  const checkoutVouchers: VoucherHook["checkoutVouchers"] = useCallback(
    (merchantCode) => {
      setCheckoutVouchersState("CONSUMING_VOUCHER");
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
            identifierInputs: [
              {
                label: "Merchant Code",
                value: merchantCode,
              },
            ],
          },
        ];

        try {
          const transactionResponse = await postTransaction({
            ids: vouchers.map((voucher) => voucher.serial),
            identificationFlag: selectedIdType,
            key: authKey,
            transactions,
            endpoint,
          });
          setCheckoutResult(transactionResponse);
          setCheckoutVouchersState("RESULT_RETURNED");
        } catch (e) {
          setError(e);
        }
      };

      checkout();
    },
    [authKey, endpoint, selectedIdType, vouchers]
  );

  return {
    checkoutVouchersState,
    vouchers,
    addVoucher,
    removeVoucher,
    checkoutVouchers,
    checkoutResult,
    error,
    resetState,
  };
};
