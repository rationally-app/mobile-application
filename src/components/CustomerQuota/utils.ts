import { CampaignPolicy } from "../../types";

export const BIG_NUMBER = 99999;

export const formatQuantityText = (
  quantity: number,
  unit?: CampaignPolicy["quantity"]["unit"]
): string =>
  unit
    ? unit?.type === "PREFIX"
      ? `${unit.label}${quantity}`
      : `${quantity}${unit.label}`
    : `${quantity}`;

export const sortTransactionsByOrder = (
  a: { order?: number },
  b: { order?: number }
): number => (a.order ?? BIG_NUMBER) - (b.order ?? BIG_NUMBER);
