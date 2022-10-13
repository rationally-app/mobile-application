import Constants from "expo-constants";

export const SENTRY_DSN: string =
  Constants.manifest2?.extra?.expoClient?.extra?.sentryDsn;
export const IS_STORYBOOK_VIEW =
  Constants.manifest2?.extra?.expoClient?.extra?.storybook;
export const IS_MOCK = Constants.manifest2?.extra?.expoClient?.extra?.mock;
export const APP_BINARY_VERSION = Constants.manifest2?.extra?.expoClient
  ?.version as string;
export const APP_BUILD_VERSION: number =
  Constants.manifest2?.extra?.expoClient?.extra?.appBuildVersion;
export const DOMAIN_FORMAT: string =
  Constants.manifest2?.extra?.expoClient?.extra?.domainFormat;
