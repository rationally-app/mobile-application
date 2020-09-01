import { CampaignPolicy } from "../../types";

export const formatQuantityText = (
  quantity: number,
  unit?: CampaignPolicy["quantity"]["unit"]
): string =>
  unit
    ? unit?.type === "PREFIX"
      ? `${unit.label}${quantity}`
      : `${quantity}${unit.label}`
    : `${quantity}`;

export const sortObjectsByHeaderAsc = (
  a: { header: string },
  b: { header: string }
): 1 | -1 | 0 => (a.header > b.header ? 1 : b.header > a.header ? -1 : 0);
