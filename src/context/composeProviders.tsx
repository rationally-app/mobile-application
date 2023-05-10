import React, {
  FunctionComponent,
  ComponentType,
  ReactElement,
  PropsWithChildren,
  ReactNode,
} from "react";

interface Providers {
  providers: ComponentType<{ children?: ReactNode | undefined }>[];
}
export const Providers: FunctionComponent<PropsWithChildren<Providers>> = ({
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
