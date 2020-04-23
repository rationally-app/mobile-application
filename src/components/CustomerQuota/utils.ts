import { chain } from "lodash";
import { PurchasedQuantitiesByItem, ItemQuantities } from "./types";
import { Policy, PostTransactionResult } from "../../types";

export const formatQuantityText = (
  quantity: number,
  unit?: Policy["quantity"]["unit"]
): string =>
  unit
    ? unit?.type === "PREFIX"
      ? `${unit.label}${quantity}`
      : `${quantity}${unit.label}`
    : `${quantity}`;

export const getPurchasedQuantitiesByItem = (
  ids: string[],
  checkoutResult: PostTransactionResult
): PurchasedQuantitiesByItem => {
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
        }, {} as ItemQuantities["quantities"])
      });
      return res;
    }, [] as ItemQuantities[]);
  return result.value();
};
