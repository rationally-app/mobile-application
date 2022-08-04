// eslint-disable-next-line @typescript-eslint/no-var-requires
const expoPreset = require("jest-expo/jest-preset");

module.exports = {
  ...expoPreset,
  verbose: true,
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
    "node_modules/(?!(jest-)|react-clone-referenced-element|@react-native-community|@react-native-async-storage|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|react-native|@react-native/.*|async-storage|@unimodules/.*|unimodules|sentry-expo|native-base|@sentry/.*)",
  ],
};
