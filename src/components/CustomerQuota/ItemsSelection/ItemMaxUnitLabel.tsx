import React, { FunctionComponent } from "react";
import { CampaignPolicy } from "../../../types";
import { formatQuantityText } from "../utils";
import { i18nt } from "../../../utils/translations";

export const ItemMaxUnitLabel: FunctionComponent<{
  unit: CampaignPolicy["quantity"]["unit"];
  maxQuantity: number;
}> = ({ unit, maxQuantity }) => {
  return (
    <>
      {i18nt("customerQuotaScreen", "quotaLimitMax")}{" "}
      {formatQuantityText(maxQuantity, unit)}
    </>
  );
};
