import { get } from "lodash";
import Constants from "expo-constants";

export const IS_STORYBOOK_VIEW =
  get(Constants, "manifest.env.EXPO_START_STORYBOOK") === "true";
