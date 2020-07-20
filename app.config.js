export default ({ config }) => {
  return {
    ...config,
    extra: {
      appBuildVersion: process.env.APP_BUILD_VERSION
    }
  };
};
