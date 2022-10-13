import Constants from "expo-constants";

export const SENTRY_DSN: string = Constants.manifest2?.extra?.expoClient?.extra?.eas?.sentryDsn;
export const IS_STORYBOOK_VIEW = Constants.manifest2?.extra?.expoClient?.extra?.eas?.storybook;
export const IS_MOCK = Constants.manifest2?.extra?.expoClient?.extra?.eas?.mock;
export const APP_BINARY_VERSION = Constants.manifest?.version as string;
export const APP_BUILD_VERSION: number =
  Constants.manifest2?.extra?.expoClient?.extra?.eas?.appBuildVersion;
export const DOMAIN_FORMAT: string = Constants.manifest2?.extra?.expoClient?.extra?.eas?.domainFormat;
