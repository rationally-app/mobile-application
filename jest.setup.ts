import "@testing-library/jest-native/extend-expect";
import "isomorphic-fetch";
import mockAsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock";

jest.mock("@react-native-async-storage/async-storage", () => mockAsyncStorage);
jest.mock("react-native/Libraries/Vibration/Vibration", () => ({
  vibrate: () => "Vibration.vibrate",
}));
