export default ({ config }) => {
  return {
    ...config,
    extra: {
      appBuildVersion: process.env.BUILD_NUMBER
    }
  };
};
