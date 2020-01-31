import Constants from "expo-constants";

export const IS_STORYBOOK_VIEW =
  Constants.manifest?.env?.EXPO_START_STORYBOOK === "true" ||
  (Constants.manifest?.releaseChannel || "").indexOf("storybook") > -1;
export const BUILD_NO = Constants.manifest.revisionId || "LOCAL";
export const ENDPOINT = "https://musket-api.gdshive.io";
