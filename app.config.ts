// Typing for @expo/config is currently experimental(https://docs.expo.io/workflow/configuration/#using-typescript-for-configuration-appconfigts-instead-of)
// Install when on stable release (https://www.npmjs.com/package/@expo/config)
export default ({ config }: any): any => {
  return {
    ...config,
    version: process.env.APP_BINARY_VERSION,
    android: {
      ...config.android,
      versionCode: process.env.APP_BUILD_VERSION
        ? parseInt(process.env.APP_BUILD_VERSION)
        : 38
    },
    ios: {
      ...config.ios,
      buildNumber: process.env.APP_BUILD_VERSION
    }
  };
};
