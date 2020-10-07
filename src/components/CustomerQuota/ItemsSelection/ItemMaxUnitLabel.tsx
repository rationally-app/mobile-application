import React, { FunctionComponent } from "react";
import { CampaignPolicy } from "../../../types";
import { formatQuantityText } from "../utils";
import { i18nString } from "../../../utils/i18nString";

export const ItemMaxUnitLabel: FunctionComponent<{
  unit: CampaignPolicy["quantity"]["unit"];
  maxQuantity: number;
}> = ({ unit, maxQuantity }) => {
  return (
    <>
      {i18nString("customerQuotaScreen", "quotaLimitMax")}{" "}
      {formatQuantityText(maxQuantity, unit)}
    </>
  );
};
