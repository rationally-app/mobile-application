import AppNavigation from "./src/navigation";
import Storybook from "./storybook";
import { IS_STORYBOOK_VIEW } from "./src/config";

export default IS_STORYBOOK_VIEW ? Storybook : AppNavigation;
