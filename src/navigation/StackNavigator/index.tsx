import {
  createStackNavigator,
  StackViewTransitionConfigs
} from "react-navigation-stack";
import DocumentListScreen from "./DocumentListScreen";
import LocalDocumentScreen from "./LocalDocumentScreen";
import ScannedDocumentScreen from "./ScannedDocumentScreen";
import QrScannerScreen from "./QrScannerScreen";
import SettingsScreen from "./SettingsScreen";
import ValidityCheckScreen from "./ValidityCheckScreen";
import { color } from "../../common/styles";

const StackNavigator = createStackNavigator(
  {
    DocumentListScreen: {
      screen: DocumentListScreen
    },
    LocalDocumentScreen: {
      screen: LocalDocumentScreen
    },
    ValidityCheckScreen: {
      screen: ValidityCheckScreen
    },
    ScannedDocumentScreen: {
      screen: ScannedDocumentScreen
    },
    QrScannerScreen: {
      screen: QrScannerScreen
    },
    SettingsScreen: {
      screen: SettingsScreen
    }
  },
  {
    headerMode: "none",
    cardStyle: { backgroundColor: color("grey", 5) },
    transitionConfig: () => StackViewTransitionConfigs.SlideFromRightIOS,
    navigationOptions: {
      gesturesEnabled: true
    }
  }
);

export default StackNavigator;
