import AppNavigation from "./src/navigation";
import { Sentry } from "./src/utils/errorTracking";
import Constants from "expo-constants";
import Storybook from "./storybook";
import { IS_STORYBOOK_VIEW } from "./src/config";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  // enableInExpoDevelopment: true,
  debug: __DEV__
});
Sentry.setRelease(Constants.manifest.revisionId!);

export default IS_STORYBOOK_VIEW ? Storybook : AppNavigation;
