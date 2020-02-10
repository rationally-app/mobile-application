import AppNavigation from "./src/navigation";
import * as Sentry from "sentry-expo";
import Constants from "expo-constants";
import Storybook from "./storybook";
import { IS_STORYBOOK_VIEW } from "./src/config";

Sentry.init({
  dsn: "https://2b6599445c3946aeaf4dd31cafc56378@sentry.io/2140518",
  enableInExpoDevelopment: true,
  debug: true
});
Sentry.setRelease(Constants.manifest.revisionId!);

export default IS_STORYBOOK_VIEW ? Storybook : AppNavigation;
