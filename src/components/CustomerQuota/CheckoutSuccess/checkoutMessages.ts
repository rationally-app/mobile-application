interface CheckoutMessage {
  title: string;
  description: string;
  ctaButtonText: string;
}

export const getCheckoutMessages = (productType?: string): CheckoutMessage => {
  switch (productType?.toLowerCase()) {
    case "redeem":
      return {
        title: "Redeemed!",
        description: "Citizen has redeemed the following:",
        ctaButtonText: "Next citizen"
      };
    case "purchase":
    default:
      return {
        title: "Purchased!",
        description: "The following have been purchased:",
        ctaButtonText: "Next customer"
      };
  }
};
