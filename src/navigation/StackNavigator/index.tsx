import { createStackNavigator } from "react-navigation-stack";
import DocumentListScreen from "./DocumentListScreen";
import IndividualDocumentScreen from "./IndividualDocumentScreen";
import ScannedDocumentScreen from "./ScannedDocumentScreen";
import QrScannerScreen from "./QrScannerScreen";

const StackNavigator = createStackNavigator(
  {
    DocumentListScreen: {
      screen: DocumentListScreen
    },
    IndividualDocumentScreen: {
      screen: IndividualDocumentScreen
    },
    ScannedDocumentScreen: {
      screen: ScannedDocumentScreen
    },
    QrScannerScreen: {
      screen: QrScannerScreen
    }
  },
  {
    headerMode: "none"
  }
);

export default StackNavigator;
