import React, { FunctionComponent, PropsWithChildren } from "react";
import { Flags } from "../../flags";

export const FeatureToggler: FunctionComponent<
  PropsWithChildren<{
    feature: keyof typeof Flags;
  }>
> = ({ feature, children }) => {
  if (Flags[feature]) {
    return <>{children}</>;
  }
  return null;
};
