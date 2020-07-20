import Constants from "expo-constants";

export const IS_STORYBOOK_VIEW =
  Constants.manifest?.env?.EXPO_START_STORYBOOK === "true" ||
  (Constants.manifest?.releaseChannel || "").indexOf("storybook") > -1;
export const IS_MOCK = !!Constants.manifest?.env?.EXPO_MOCK;
export const BUILD_NO = Constants.manifest.revisionId || "LOCAL";
export const APP_BUILD_VERSION = Constants.manifest?.extra?.appBuildVersion;
