import React, { FunctionComponent } from "react";
import { Policy } from "../../../types";

export const ItemMaxUnitLabel: FunctionComponent<{
  unit: Policy["quantity"]["unit"];
  maxQuantity: number;
}> = ({ unit, maxQuantity }) => {
  const maxUnit = unit
    ? unit?.type === "PREFIX"
      ? `${unit.label}${maxQuantity}`
      : `${maxQuantity}${unit.label}`
    : maxQuantity;
  return <>(max {maxUnit})</>;
};
