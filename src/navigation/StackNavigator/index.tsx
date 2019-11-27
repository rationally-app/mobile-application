import { createStackNavigator } from "react-navigation-stack";
import DocumentListScreen from "./DocumentListScreen";
import LocalDocumentScreen from "./LocalDocumentScreen";
import ScannedDocumentScreen from "./ScannedDocumentScreen";
import QrScannerScreen from "./QrScannerScreen";

const StackNavigator = createStackNavigator(
  {
    DocumentListScreen: {
      screen: DocumentListScreen
    },
    LocalDocumentScreen: {
      screen: LocalDocumentScreen
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
