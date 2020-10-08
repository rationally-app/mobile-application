import { i18nt } from "../../../utils/translations";

interface CheckoutMessage {
  title: string;
  description: string;
  ctaButtonText: string;
}

export const getCheckoutMessages = (productType?: string): CheckoutMessage => {
  switch (productType) {
    case "REDEEM":
      return {
        title: `${i18nt("checkoutSuccessScreen", "redeemed")}!`,
        description: `${i18nt("checkoutSuccessScreen", "redeemedItems")}:`,
        ctaButtonText: i18nt("checkoutSuccessScreen", "redeemedNextIdentity")
      };
    case "PURCHASE":
    default:
      return {
        title: `${i18nt("checkoutSuccessScreen", "purchased")}!`,
        description: `${i18nt("checkoutSuccessScreen", "purchasedItems")}:`,
        ctaButtonText: i18nt("checkoutSuccessScreen", "purchasedNextIdentity")
      };
  }
};
