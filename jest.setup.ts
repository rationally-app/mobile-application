import "react-native-gesture-handler/jestSetup";
import "@testing-library/jest-native/extend-expect";
import "isomorphic-fetch";

jest.mock("@expo/vector-icons", () => ({
  Feather: "Feather Icons",
  Ionicons: "Ionicons Icons",
  AntDesign: "AntDesign Icons",
  FontAwesome: "FontAwesome Icons"
}));
