import { CampaignPolicy } from "../../types";

export const BIG_NUMBER = 99999;

export const formatQuantityText = (
  quantity: number,
  unit?: CampaignPolicy["quantity"]["unit"]
): string =>
  unit
    ? unit?.type === "PREFIX"
      ? `${unit.label}${quantity.toLocaleString()}`
      : `${quantity.toLocaleString()}${unit.label}`
    : `${quantity.toLocaleString()}`;

export const sortTransactionsByOrder = (
  a: { order: number },
  b: { order: number }
): number => a.order - b.order;
