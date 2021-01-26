import { TranslationHook } from "../../../hooks/useTranslate/useTranslate";

interface CheckoutMessage {
  title: string;
  description: string;
}

export const getCheckoutMessages = (
  i18nt: TranslationHook["i18nt"],
  productType?: string
): CheckoutMessage => {
  switch (productType) {
    case "REDEEM":
      return {
        title: `${i18nt("checkoutSuccessScreen", "redeemed")}!`,
        description: `${i18nt("checkoutSuccessScreen", "redeemedItems")}:`,
      };
    case "RETURN":
      return {
        title: `${i18nt("checkoutSuccessScreen", "returned")}`,
        description: `${i18nt("checkoutSuccessScreen", "returnedItems")}:`,
      };
    case "PURCHASE":
    default:
      return {
        title: `${i18nt("checkoutSuccessScreen", "purchased")}!`,
        description: `${i18nt("checkoutSuccessScreen", "purchasedItems")}:`,
      };
  }
};
