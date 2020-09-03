import { NavigationProps } from "../../types";
import { ParamListBase } from "@react-navigation/native";

export const replaceRouteFn = <
  T extends ParamListBase,
  K extends Extract<keyof T, string>
>(
  navigation: NavigationProps["navigation"],
  routeName: K
): (() => void) => (): void => {
  // Any casting is required to not provide key
  const action: any = {
    routeName,
    type: "Navigation/REPLACE"
  };
  return navigation.dispatch(action);
};

export const resetRouteFn = (
  navigation: NavigationProps["navigation"],
  routeName: string
): (() => void) => (): void => {
  // Any casting is required to not provide key
  const action: any = {
    routeName,
    type: "Navigation/RESET"
  };
  return navigation.dispatch(action);
};
