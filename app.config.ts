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
const androidVersionCode: number = parseInt(buildNumber);

export default ({ config }: any): any => {
  return {
    ...config,
    version: getValue(
      process.env.APP_BINARY_VERSION,
      "Please provide a App Version with APP_BINARY_VERSION env variable"
    ),
    android: {
      ...config.android,
      versionCode: androidVersionCode
    },
    ios: {
      ...config.ios,
      buildNumber
    }
  };
};
