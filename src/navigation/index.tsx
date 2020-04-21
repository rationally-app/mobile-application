import React, { ReactElement } from "react";
import { AuthenticationContextProvider } from "../context/auth";
import { ConfigContextProvider } from "../context/config";
import { ProductContextProvider } from "../context/products";
import { FontLoader } from "../components/FontLoader";
import { ErrorBoundary } from "../components/ErrorBoundary/ErrorBoundary";
import { HelpModalContextProvider } from "../context/help";
import { ImportantMessageContextProvider } from "../context/importantMessage";
import { Content } from "./Content";

const App = (): ReactElement => {
  return (
    <ErrorBoundary>
      <FontLoader>
        <ConfigContextProvider>
          <ProductContextProvider>
            <AuthenticationContextProvider>
              <HelpModalContextProvider>
                <ImportantMessageContextProvider>
                  <Content />
                </ImportantMessageContextProvider>
              </HelpModalContextProvider>
            </AuthenticationContextProvider>
          </ProductContextProvider>
        </ConfigContextProvider>
      </FontLoader>
    </ErrorBoundary>
  );
};

export default App;
