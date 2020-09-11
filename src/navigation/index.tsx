import React, { ReactElement } from "react";
import { AuthStoreContextProvider } from "../context/authStore";
import { ConfigContextProvider } from "../context/config";
import { FontLoader } from "../components/FontLoader";
import { ErrorBoundary } from "../components/ErrorBoundary/ErrorBoundary";
import { HelpModalContextProvider } from "../context/help";
import { AlertModalContextProvider } from "../context/alert";
import { ImportantMessageContextProvider } from "../context/importantMessage";
import { Content } from "./Content";
import { Providers } from "../context/composeProviders";
import { DrawerContextProvider } from "../context/drawer";
import { CampaignConfigsStoreContextProvider } from "../context/campaignConfigsStore";
import { LocalizationContextProvider } from "../context/translation";

const App = (): ReactElement => {
  return (
    <ErrorBoundary>
      <FontLoader>
        <LocalizationContextProvider>
          <Providers
            providers={[
              ConfigContextProvider,
              AuthStoreContextProvider,
              CampaignConfigsStoreContextProvider,
              HelpModalContextProvider,
              AlertModalContextProvider,
              ImportantMessageContextProvider,
              DrawerContextProvider
            ]}
          >
            <Content />
          </Providers>
        </LocalizationContextProvider>
      </FontLoader>
    </ErrorBoundary>
  );
};

export default App;
