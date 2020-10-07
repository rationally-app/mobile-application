import React, { FunctionComponent } from "react";
import { CampaignPolicy } from "../../../types";
import { formatQuantityText } from "../utils";
import { getTranslatedStringWithI18n } from "../../../utils/translations";

export const ItemMaxUnitLabel: FunctionComponent<{
  unit: CampaignPolicy["quantity"]["unit"];
  maxQuantity: number;
}> = ({ unit, maxQuantity }) => {
  return (
    <>
      {getTranslatedStringWithI18n("customerQuotaScreen", "quotaLimitMax")}{" "}
      {formatQuantityText(maxQuantity, unit)}
    </>
  );
};
