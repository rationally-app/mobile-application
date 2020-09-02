import React, { ReactElement, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
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
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Linking from "expo-linking";

const App = (): ReactElement => {
  const prefix = Linking.makeUrl("/");
  const navigationRef = useRef(null);

  return (
    <ErrorBoundary>
      <FontLoader>
        <Providers
          providers={[
            ConfigContextProvider,
            AuthStoreContextProvider,
            CampaignConfigsStoreContextProvider,
            HelpModalContextProvider,
            AlertModalContextProvider,
            ImportantMessageContextProvider,
            DrawerContextProvider,
            SafeAreaProvider
          ]}
        >
          <NavigationContainer
            linking={{
              prefixes: [prefix]
            }}
            ref={navigationRef}
          >
            <Content />
          </NavigationContainer>
        </Providers>
      </FontLoader>
    </ErrorBoundary>
  );
};

export default App;
