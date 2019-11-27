import { NavigationProps } from "../types";
import { StackActions } from "react-navigation";

export const replaceRouteFn = (
  navigation: NavigationProps["navigation"],
  routeName: string
): (() => boolean) => (): boolean => {
  const action = StackActions.replace({ routeName });
  return navigation.dispatch(action);
};
