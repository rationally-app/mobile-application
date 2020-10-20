import dotenv from "dotenv";
dotenv.config();

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// Typing for @expo/config is currently experimental(https://docs.expo.io/workflow/configuration/#using-typescript-for-configuration-appconfigts-instead-of)
// Install when on stable release (https://www.npmjs.com/package/@expo/config)
const getValue = (value: string | undefined, message: string): string => {
  if (!value) {
    throw new Error(message);
  }
  return value;
};
const buildNumber: string = getValue(
  process.env.APP_BUILD_VERSION,
  "Please provide a Build Version with APP_BUILD_VERSION env variable"
);
// The APP_BUILD_VERSION number is 38 behind the actual deploy, adding 38 synchronises the build number
const appBuildVersion = parseInt(buildNumber) + 38;

export default ({ config }: any): any => {
  return {
    ...config,
    version: getValue(
      process.env.APP_BINARY_VERSION,
      "Please provide a App Version with APP_BINARY_VERSION env variable"
    ),
    android: {
      ...config.android,
      versionCode: appBuildVersion,
    },
    ios: {
      ...config.ios,
      buildNumber: appBuildVersion.toString(),
    },
    extra: {
      mock: process.env.MOCK === "true",
      storybook: process.env.START_STORYBOOK === "true",
      appBuildVersion,
      sentryDsn: getValue(
        process.env.SENTRY_DSN,
        "Please specify a SENTRY_DSN env variable"
      ),
      domainFormat: getValue(
        process.env.DOMAIN_FORMAT,
        "Please specify a DOMAIN_FORMAT env variable"
      ),
    },
    hooks: {
      postPublish: [
        {
          file: "sentry-expo/upload-sourcemaps",
          config: {
            organization: getValue(
              process.env.SENTRY_ORG,
              "Please specify a SENTRY_ORG env variable"
            ),
            project: getValue(
              process.env.SENTRY_PROJECT,
              "Please specify a SENTRY_PROJECT env variable"
            ),
            authToken: getValue(
              process.env.SENTRY_AUTH_TOKEN,
              "Please specify a SENTRY_AUTH_TOKEN env variable"
            ),
          },
        },
      ],
    },
  };
};
