import Constants from "expo-constants";

export const IS_STORYBOOK_VIEW =
  Constants.manifest?.env?.EXPO_START_STORYBOOK === "true" ||
  (Constants.manifest?.releaseChannel || "").indexOf("storybook") > -1;
export const IS_MOCK = !!Constants.manifest?.env?.EXPO_MOCK;
export const BUILD_NO = Constants.manifest.revisionId || "LOCAL";
export const STAGING_ENDPOINT = "https://api.staging.rationally.gdshive.io";
export const PRODUCTION_ENDPOINT = "https://api.rationally.gdshive.io";
