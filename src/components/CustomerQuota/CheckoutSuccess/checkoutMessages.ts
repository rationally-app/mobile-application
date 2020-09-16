import i18n from "i18n-js";

interface CheckoutMessage {
  title: string;
  description: string;
  ctaButtonText: string;
}

export const getCheckoutMessages = (productType?: string): CheckoutMessage => {
  switch (productType) {
    case "REDEEM":
      return {
        title: i18n.t("checkoutSuccessScreen.redeemed"),
        description: i18n.t("checkoutSuccessScreen.redeemedItems"),
        ctaButtonText: i18n.t("checkoutSuccessScreen.redeemedNextIdentity")
      };
    case "PURCHASE":
    default:
      return {
        title: i18n.t("checkoutSuccessScreen.purchased"),
        description: i18n.t("checkoutSuccessScreen.purchasedItems"),
        ctaButtonText: i18n.t("checkoutSuccessScreen.purchasedNextIdentity")
      };
  }
};
