import Constants from "expo-constants";
import { AppManifest } from "expo-constants/build/Constants.types";
import { expo as manifest} from "../../app.json";
import * as Updates from "expo-updates";

export const SENTRY_DSN: string = (manifest as unknown as AppManifest)?.extra?.sentryDsn;
export const IS_STORYBOOK_VIEW =
  (manifest as unknown as AppManifest)?.extra?.storybook ||
  ((manifest as unknown as AppManifest)?.releaseChannel || "").indexOf("storybook") > -1;
export const IS_MOCK = (manifest as unknown as AppManifest)?.extra?.mock;
export const APP_BINARY_VERSION = (manifest as unknown as AppManifest)?.version as string;
export const APP_BUILD_VERSION: number =
  (manifest as unknown as AppManifest)?.extra?.appBuildVersion;
export const DOMAIN_FORMAT: string = (manifest as unknown as AppManifest)?.extra?.domainFormat;
