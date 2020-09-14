import React, { FunctionComponent } from "react";
import { CampaignPolicy } from "../../../types";
import { formatQuantityText } from "../utils";

export const ItemMaxUnitLabel: FunctionComponent<{
  unit: CampaignPolicy["quantity"]["unit"];
  maxQuantity: number;
}> = ({ unit, maxQuantity }) => {
  return <>max {formatQuantityText(maxQuantity, unit)}</>;
};
