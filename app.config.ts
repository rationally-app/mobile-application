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

export default ({ config }: any): any => {
  return {
    ...config,
    runtimeVersion: {
      policy: "sdkVersion"
    },
    updates: {
      url: "https://u.expo.dev/1662dd57-66f7-4845-b0c0-25b3f28fff6c"
    },
    extra: {
      mock: process.env.MOCK === "true",
      storybook: process.env.START_STORYBOOK === "true",
      sentryDsn: getValue(
        process.env.SENTRY_DSN,
        "Please specify a SENTRY_DSN env variable"
      ),
      domainFormat: getValue(
        process.env.DOMAIN_FORMAT,
        "Please specify a DOMAIN_FORMAT env variable"
      ),
      eas: {
        projectId: "1662dd57-66f7-4845-b0c0-25b3f28fff6c"
      }
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
