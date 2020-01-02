import AppNavigation from "./src/navigation";
import Storybook from "./storybook";
import { IS_STORYBOOK_VIEW } from "./src/config";
import { YellowBox } from "react-native";

YellowBox.ignoreWarnings(["Setting a timer"]);

export default IS_STORYBOOK_VIEW ? Storybook : AppNavigation;
