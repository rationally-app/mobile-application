import "@testing-library/jest-native/extend-expect";
import "isomorphic-fetch";

jest.mock("react-native/Libraries/Vibration/Vibration", () => ({
  vibrate: () => "Vibration.vibrate",
}));
