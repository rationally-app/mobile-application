// eslint-disable-next-line @typescript-eslint/no-var-requires
const expoPreset = require("jest-expo/jest-preset");
// jest.config.js
module.exports = {
  ...expoPreset,
  verbose: true,
  preset: "@testing-library/react-native",
  moduleNameMapper: {
    "\\.svg": "<rootDir>/__mocks__/svg-mock.ts",
  },
  coveragePathIgnorePatterns: [
    "<rootDir>/build/",
    "<rootDir>/node_modules/",
    "<rootDir>/src/test/",
  ],
  setupFilesAfterEnv: ["./jest.setup.ts"],
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?react-native|react-clone-referenced-element|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|@sentry/.*)",
  ],
};
