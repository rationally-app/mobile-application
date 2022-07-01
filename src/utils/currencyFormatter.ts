/**
 * Utility function that converts a currency amount represented in cents to
 * its string representation in dollars and cents.
 *
 * @param amountInCents Amount in cents
 * @param separator Separator character between dollars and cents
 * @returns Amount in dollars and cents, as a string
 */
export const formatCentsAsDollarsAndCents = (
  amountInCents: number,
  separator = "."
): string => {
  const amountString = amountInCents.toString();
  if (amountString.length < 3) {
    const centsString = amountString.padStart(2, "0");
    return `0${separator}${centsString}`;
  } else {
    const dollarString = amountString.slice(0, -2);
    const centsString = amountString.slice(-2);
    return `${dollarString}${separator}${centsString}`;
  }
};
