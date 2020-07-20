export default ({ config }) => {
  return {
    ...config,
    extra: {
      buildnumber: process.env.BUILD_NUMBER
    }
  };
};
