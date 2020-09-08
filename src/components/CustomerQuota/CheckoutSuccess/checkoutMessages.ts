interface CheckoutMessage {
  title: string;
  description: string;
  ctaButtonText: string;
}

export const getCheckoutMessages = (productType?: string): CheckoutMessage => {
  switch (productType) {
    case "REDEEM":
      return {
        title: "Redeemed!",
        description: "Item(s) redeemed:",
        ctaButtonText: "Next identity"
      };
    case "PURCHASE":
    default:
      return {
        title: "Purchased!",
        description: "The following have been purchased:",
        ctaButtonText: "Next identity"
      };
  }
};
