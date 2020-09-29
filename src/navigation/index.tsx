import React, { ReactElement, useEffect } from "react";
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
import { IdentificationContextProvider } from "../context/identification";
import ScanbotSDK, { InitializationOptions } from "react-native-scanbot-sdk/src";
import { SDKUtils } from "../utils/SDKUtils";


const App = (): ReactElement => {

  const initScanbotSdk = async () => {
    const options: InitializationOptions = {
      licenseKey: SDKUtils.SDK_LICENSE_KEY,
      loggingEnabled: true, // Consider switching logging OFF in production builds for security and performance reasons!
      storageImageFormat: "JPG",
      storageImageQuality: 80,
      storageBaseDirectory: "", // Optional custom storage path. See comments below!
      documentDetectorMode: "ML_BASED"
    };
    return await ScanbotSDK.initializeSDK(options);
  };

  useEffect(() => {
    initScanbotSdk().then(r => console.log(r));
  }, []);

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
            IdentificationContextProvider
          ]}
        >
          <Content />
        </Providers>
      </FontLoader>
    </ErrorBoundary>
  );
};

export default App;
