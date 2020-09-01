import { chain } from "lodash";
import { CheckoutQuantitiesByItem, ItemQuantities } from "./types";
import { PostTransactionResult, CampaignPolicy } from "../../types";

export const formatQuantityText = (
  quantity: number,
  unit?: CampaignPolicy["quantity"]["unit"]
): string =>
  unit
    ? unit?.type === "PREFIX"
      ? `${unit.label}${quantity}`
      : `${quantity}${unit.label}`
    : `${quantity}`;

export const getPurchasedQuantitiesByItem = (
  ids: string[],
  checkoutResult: PostTransactionResult
): CheckoutQuantitiesByItem => {
  const result = chain(checkoutResult.transactions)
    .map((user, idx) =>
      user.transaction.map(transaction => ({
        ...transaction,
        id: ids[idx]
      }))
    )
    .flatten()
    .groupBy("category")
    .reduce((res, users, category) => {
      res.push({
        category,
        quantities: users.reduce((res, user) => {
          res[user.id] = user.quantity;
          return res;
        }, {} as ItemQuantities["quantities"]),
        identifierInputs: users[0].identifierInputs // Transactions with identifierInputs can only have single NRIC
      });
      return res;
    }, [] as ItemQuantities[]);
  return result.value();
};

export const sortObjectsByHeaderAsc = (
  a: { header: string },
  b: { header: string }
): 1 | -1 | 0 => (a.header > b.header ? 1 : b.header > a.header ? -1 : 0);
