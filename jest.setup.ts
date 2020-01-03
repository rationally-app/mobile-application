import "react-native-gesture-handler/jestSetup";
import "@testing-library/jest-native/extend-expect";
import "isomorphic-fetch";

jest.mock("@expo/vector-icons", () => ({
  Feather: "Feather Icons",
  Ionicons: "Ionicons Icons",
  AntDesign: "AntDesign Icons",
  FontAwesome: "FontAwesome Icons"
}));

jest.mock("expo-constants", () => ({ manifest: { revisionId: "BUILD NO" } }));
jest.mock("expo-sqlite", () => ({ default: {} }));

const globalAny: any = global;
globalAny.alert = jest.fn(); // eslint-disable-line jest/prefer-spy-on
