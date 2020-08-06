import React, { ReactElement } from "react";
import { AuthenticationContextProvider } from "../context/auth";
import { ConfigContextProvider } from "../context/config";
import { ProductContextProvider } from "../context/products";
import { FontLoader } from "../components/FontLoader";
import { ErrorBoundary } from "../components/ErrorBoundary/ErrorBoundary";
import { HelpModalContextProvider } from "../context/help";
import { AlertModalContextProvider } from "../context/alert";
import { ImportantMessageContextProvider } from "../context/importantMessage";
import { Content } from "./Content";
import { Providers } from "../context/composeProviders";
import { DrawerContextProvider } from "../context/drawer";
import { CampaignConfigContextProvider } from "../context/campaignConfig";

const App = (): ReactElement => {
  return (
    <ErrorBoundary>
      <FontLoader>
        <Providers
          providers={[
            ConfigContextProvider,
            CampaignConfigContextProvider,
            ProductContextProvider,
            AuthenticationContextProvider,
            HelpModalContextProvider,
            AlertModalContextProvider,
            ImportantMessageContextProvider,
            DrawerContextProvider
          ]}
        >
          <Content />
        </Providers>
      </FontLoader>
    </ErrorBoundary>
  );
};

export default App;
