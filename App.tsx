import AppNavigation from "./src/navigation";
import { Sentry } from "./src/utils/errorTracking";
import Constants from "expo-constants";
import { IS_STORYBOOK_VIEW, SENTRY_DSN } from "./src/config";
import Storybook from "./storybook";

Sentry.init({
  dsn: SENTRY_DSN,
  // enableInExpoDevelopment: true,
  debug: __DEV__,
});
Sentry.setRelease(Constants.manifest.revisionId!);

export default IS_STORYBOOK_VIEW ? Storybook : AppNavigation;
