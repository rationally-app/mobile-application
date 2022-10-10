import Constants from "expo-constants";

export const SENTRY_DSN: string = Constants.manifest?.extra?.sentryDsn;
export const IS_STORYBOOK_VIEW = Constants.manifest?.extra?.storybook;
export const IS_MOCK = Constants.manifest?.extra?.mock;
export const APP_BINARY_VERSION = Constants.manifest?.version as string;
export const APP_BUILD_VERSION: number =
  Constants.manifest?.extra?.appBuildVersion;
export const DOMAIN_FORMAT: string = Constants.manifest?.extra?.domainFormat;
