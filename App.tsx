import AppNavigation from "./src/navigation";
import * as Sentry from "sentry-expo";
import Constants from "expo-constants";

Sentry.init({
  dsn: "https://2b6599445c3946aeaf4dd31cafc56378@sentry.io/2140518",
  enableInExpoDevelopment: true,
  debug: true
});
Sentry.setRelease(Constants.manifest.revisionId!);

export default AppNavigation;
