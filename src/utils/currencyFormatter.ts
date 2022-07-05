/**
 * Utility function that converts a currency amount represented in cents to
 * its string representation in dollars and cents.
 *
 * @param amountInCents Amount in cents
 * @param separator Separator character between dollars and cents
 * @returns Amount in dollars and cents, as a string
 */
export const formatCentsAsDollarsAndCents = (amountInCents: number): string => {
  const amountInDollarsAndCents = amountInCents / 100;
  return amountInDollarsAndCents.toLocaleString("en-SG", {
    minimumFractionDigits: 2,
  });
};
