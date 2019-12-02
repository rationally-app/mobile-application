import Constants from "expo-constants";
import * as db from "./db";

export const DB_CONFIG = db;
export const IS_STORYBOOK_VIEW =
  Constants.manifest?.env?.EXPO_START_STORYBOOK === "true" ||
  (Constants.manifest?.releaseChannel || "").indexOf("storybook") > -1;
export const BUILD_NO = Constants.manifest.revisionId || "LOCAL";
