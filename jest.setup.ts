import "@testing-library/jest-native/extend-expect";
jest.mock("@expo/vector-icons", () => ({
  Feather: "Feather Icons",
  Ionicons: "Ionicons Icons"
}));
