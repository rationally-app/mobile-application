import { i18nString } from "../../../utils/i18nString";

interface CheckoutMessage {
  title: string;
  description: string;
  ctaButtonText: string;
}

export const getCheckoutMessages = (productType?: string): CheckoutMessage => {
  switch (productType) {
    case "REDEEM":
      return {
        title: `${i18nString("checkoutSuccessScreen", "redeemed")}!`,
        description: `${i18nString("checkoutSuccessScreen", "redeemedItems")}:`,
        ctaButtonText: i18nString(
          "checkoutSuccessScreen",
          "redeemedNextIdentity"
        )
      };
    case "PURCHASE":
    default:
      return {
        title: `${i18nString("checkoutSuccessScreen", "purchased")}!`,
        description: `${i18nString(
          "checkoutSuccessScreen",
          "purchasedItems"
        )}:`,
        ctaButtonText: i18nString(
          "checkoutSuccessScreen",
          "purchasedNextIdentity"
        )
      };
  }
};
