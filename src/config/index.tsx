import { AppManifest } from "expo-constants/build/Constants.types";
import { expo as manifest} from "../../app.json";

export const SENTRY_DSN: string = (manifest as AppManifest)?.extra?.sentryDsn;
export const IS_STORYBOOK_VIEW =
  (manifest as AppManifest)?.extra?.storybook ||
  ((manifest as AppManifest)?.releaseChannel || "").indexOf("storybook") > -1;
export const IS_MOCK = (manifest as AppManifest)?.extra?.mock;
export const APP_BINARY_VERSION = (manifest as AppManifest)?.version as string;
export const APP_BUILD_VERSION: number =
  (manifest as AppManifest)?.extra?.appBuildVersion;
export const DOMAIN_FORMAT: string = (manifest as AppManifest)?.extra
  ?.domainFormat;
