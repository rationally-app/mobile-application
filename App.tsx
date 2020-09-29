import AppNavigation from "./src/navigation";
import { Sentry } from "./src/utils/errorTracking";
import { expo as manifest} from "./app.json";
import Storybook from "./storybook";
import { IS_STORYBOOK_VIEW, SENTRY_DSN } from "./src/config";
import { AppManifest } from "expo-constants/build/Constants.types";


Sentry.init({
  dsn: SENTRY_DSN,
  // enableInExpoDevelopment: true,
  debug: __DEV__
});
Sentry.setRelease((manifest as AppManifest).revisionId!);

export default IS_STORYBOOK_VIEW ? Storybook : AppNavigation;
