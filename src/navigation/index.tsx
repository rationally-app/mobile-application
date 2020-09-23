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
import * as Localization from "expo-localization";
import zh from "../common/i18n/translations/zh.json";
import en from "../common/i18n/translations/en.json";
import i18n from "i18n-js";

i18n.fallbacks = true;
i18n.locale = Localization.locale;
i18n.translations = {
  zh,
  en
};
i18n.missingTranslation = function () {
  return undefined;
};

const App = (): ReactElement => {
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
