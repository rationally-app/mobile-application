import Constants from "expo-constants";

export const IS_STORYBOOK_VIEW =
  Constants.manifest?.extra?.storybook ||
  (Constants.manifest?.releaseChannel || "").indexOf("storybook") > -1;
export const IS_MOCK = Constants.manifest?.extra?.mock;
