import React, {
  FunctionComponent,
  ComponentType,
  ReactElement,
  PropsWithChildren,
} from "react";

interface Providers {
  providers: {
    provider: ComponentType<any> | FunctionComponent<any>;
    props?: Record<any, any>;
  }[];
}

/**
 * Test helper function to dynamically wrap the tested components with the required context providers.
 * The order of the context providers is important!
 *
 * Current order used based on src/navigation/index:
 * - ErrorBoundary
 * - FontLoader
 * - ConfigContextProvider
 * - AuthStoreContextProvider
 * - CampaignConfigsStoreContextProvider
 * - HelpModalContextProvider
 * - AlertModalContextProvider
 * - ImportantMessageContextProvider
 * - DrawerContextProvider
 * - IdentificationContextProvider
 *
 * @param providers Provider component and its props if required
 */
export const CreateProvidersWrapper: FunctionComponent<
  PropsWithChildren<Providers>
> = ({ providers, children }): ReactElement => (
  <>
    {providers.reduceRight((composed, newProvider) => {
      const { provider: Provider, props } = newProvider;
      return <Provider {...props}>{composed}</Provider>;
    }, <>{children}</>)}
  </>
);
