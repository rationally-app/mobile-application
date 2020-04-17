import React, { FunctionComponent } from "react";
import { Flags } from "../../flags";

export const FeatureToggler: FunctionComponent<{
  feature: keyof typeof Flags;
}> = ({ feature, children }) => {
  if (Flags[feature]) {
    return <>{children}</>;
  }
  return null;
};
