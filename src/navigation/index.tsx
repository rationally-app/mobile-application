import React, { ReactElement } from "react";
import { AuthenticationContextProvider } from "../context/auth";
import { ConfigContextProvider } from "../context/config";
import { ProductContextProvider } from "../context/products";
import { FontLoader } from "../components/FontLoader";
import { ErrorBoundary } from "../components/ErrorBoundary/ErrorBoundary";
import { HelpModalContextProvider } from "../context/help";
import { ImportantMessageContextProvider } from "../context/importantMessage";
import { Content } from "./Content";
import { Providers } from "../context/composeProviders";
import { DrawerContextProvider } from "../context/drawer";

const App = (): ReactElement => {
  return (
    <ErrorBoundary>
      <FontLoader>
        <Providers
          providers={[
            ConfigContextProvider,
            ProductContextProvider,
            AuthenticationContextProvider,
            HelpModalContextProvider,
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
