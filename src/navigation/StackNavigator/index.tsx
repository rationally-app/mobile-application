import { createStackNavigator } from "react-navigation-stack";
import DocumentListScreen from "./DocumentListScreen";
import IndividualDocumentScreen from "./IndividualDocumentScreen";

const StackNavigator = createStackNavigator(
  {
    DocumentListScreen: {
      screen: DocumentListScreen
    },
    IndividualDocumentScreen: {
      screen: IndividualDocumentScreen
    }
  },
  {
    headerMode: "none"
  }
);

export default StackNavigator;
