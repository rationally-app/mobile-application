// jest.config.js
module.exports = {
  verbose: true,
  preset: "@testing-library/react-native",
  moduleNameMapper: {
    "\\.svg": "<rootDir>/__mocks__/SvgMock.ts"
  },
  setupFilesAfterEnv: ["./jest.setup.ts"]
};
