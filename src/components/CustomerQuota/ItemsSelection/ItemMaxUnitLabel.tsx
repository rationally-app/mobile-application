import React, { FunctionComponent } from "react";
import { CampaignPolicy } from "../../../types";
import { formatQuantityText } from "../utils";
import i18n from "i18n-js";

export const ItemMaxUnitLabel: FunctionComponent<{
  unit: CampaignPolicy["quantity"]["unit"];
  maxQuantity: number;
}> = ({ unit, maxQuantity }) => {
  return (
    <>
      {i18n.t("customerQuotaScreen.quotaLimitMax")}{" "}
      {formatQuantityText(maxQuantity, unit)}
    </>
  );
};
