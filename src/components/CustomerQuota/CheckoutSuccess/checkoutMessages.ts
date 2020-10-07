import { getTranslatedStringWithI18n } from "../../../utils/translations";

interface CheckoutMessage {
  title: string;
  description: string;
  ctaButtonText: string;
}

export const getCheckoutMessages = (productType?: string): CheckoutMessage => {
  switch (productType) {
    case "REDEEM":
      return {
        title: `${getTranslatedStringWithI18n(
          "checkoutSuccessScreen",
          "redeemed"
        )}!`,
        description: `${getTranslatedStringWithI18n(
          "checkoutSuccessScreen",
          "redeemedItems"
        )}:`,
        ctaButtonText: getTranslatedStringWithI18n(
          "checkoutSuccessScreen",
          "redeemedNextIdentity"
        )
      };
    case "PURCHASE":
    default:
      return {
        title: `${getTranslatedStringWithI18n(
          "checkoutSuccessScreen",
          "purchased"
        )}!`,
        description: `${getTranslatedStringWithI18n(
          "checkoutSuccessScreen",
          "purchasedItems"
        )}:`,
        ctaButtonText: getTranslatedStringWithI18n(
          "checkoutSuccessScreen",
          "purchasedNextIdentity"
        )
      };
  }
};
