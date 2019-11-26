import "react-native-gesture-handler/jestSetup";
import "@testing-library/jest-native/extend-expect";
import "isomorphic-fetch";

jest.mock("@expo/vector-icons", () => ({
  Feather: "Feather Icons",
  Ionicons: "Ionicons Icons"
}));

jest.mock("react-native-reanimated", () => {
  // eslint-disable-next-line jest/no-mocks-import
  return require("./__mocks__/ReactNativeReanimated");
});
