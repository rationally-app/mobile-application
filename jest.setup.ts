import "@testing-library/jest-native/extend-expect";
import "isomorphic-fetch";

const mockAsyncStorage = require("@react-native-async-storage/async-storage/jest/async-storage-mock");

jest.mock("react-native/Libraries/Vibration/Vibration", () => ({
  vibrate: () => "Vibration.vibrate",
}));
