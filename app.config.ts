// Typing for @expo/config is currently experimental(https://docs.expo.io/workflow/configuration/#using-typescript-for-configuration-appconfigts-instead-of)
// Install when on stable release (https://www.npmjs.com/package/@expo/config)
export default ({ config }: any): any => {
  return {
    ...config,
    version: process.env.VERSION,
    android: {
      ...config.android,
      versionCode: process.env.APP_BINARY_VERSION
    },
    ios: {
      ...config.ios,
      buildNumber: process.env.APP_BINARY_VERSION
    }
  };
};
