import AppNavigation from "./src/navigation";
import * as Sentry from "sentry-expo";
import Constants from "expo-constants";
import Storybook from "./storybook";
import { IS_STORYBOOK_VIEW } from "./src/config";
import { SENTRY_DSN } from "react-native-dotenv";

Sentry.init({
  dsn: process.env.SENTRY_DSN || SENTRY_DSN,
  // enableInExpoDevelopment: true,
  debug: __DEV__
});
Sentry.setRelease(Constants.manifest.revisionId!);

export default IS_STORYBOOK_VIEW ? Storybook : AppNavigation;
