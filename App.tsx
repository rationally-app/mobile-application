import AppNavigation from "./src/navigation";
import { Sentry } from "./src/utils/errorTracking";
import Constants from "expo-constants";
import Storybook from "./storybook";
import { IS_STORYBOOK_VIEW, SENTRY_DSN } from "./src/config";

Sentry.init({
  dsn: SENTRY_DSN,
  // enableInExpoDevelopment: true,
  debug: __DEV__,
});

export default IS_STORYBOOK_VIEW ? Storybook : AppNavigation;
