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
        description: "Item(s) redeemed:",
<<<<<<< HEAD
        ctaButtonText: "Next identity"
=======
        ctaButtonText: "Next citizen"
>>>>>>> 167b27e... style: amend checkout message
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
