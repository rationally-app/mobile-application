import React, { FunctionComponent } from "react";
import { useTranslate } from "../../../hooks/useTranslate/useTranslate";
import { CampaignPolicy } from "../../../types";
import { formatQuantityText } from "../utils";

export const ItemMaxUnitLabel: FunctionComponent<{
  unit: CampaignPolicy["quantity"]["unit"];
  maxQuantity: number;
}> = ({ unit, maxQuantity }) => {
  const { i18nt, c13ntForUnit } = useTranslate();
  const tUnit = c13ntForUnit(unit);
  return (
    <>
      {i18nt("customerQuotaScreen", "quotaLimitMax")}
      {". "}
      {formatQuantityText(maxQuantity, tUnit)}
    </>
  );
};
