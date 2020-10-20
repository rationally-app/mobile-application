import React, { FunctionComponent, ComponentType, ReactElement } from "react";

interface Providers {
  providers: ComponentType[];
}
export const Providers: FunctionComponent<Providers> = ({
  providers,
  children,
}): ReactElement => (
  <>
    {providers.reduceRight(
      (composed, Provider) => (
        <Provider>{composed}</Provider>
      ),
      <>{children}</>
    )}
  </>
);
