import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState
} from "react-navigation";

export interface NavigationProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}
