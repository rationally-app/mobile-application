import { NavigationProps } from "../types";
import { StackActions, ParamListBase } from "@react-navigation/native";

export const replaceRouteFn = <
  T extends ParamListBase,
  K extends Extract<keyof T, string>
>(
  navigation: NavigationProps["navigation"],
  routeName: K,
  params?: T[K]
): (() => void) => (): void => {
  const action = StackActions.replace(routeName, params);
  return navigation.dispatch(action);
};

// This resets the entire stack and puts the navigated route right on top of the home page
export const resetRouteFn = <
  T extends ParamListBase,
  K extends Extract<keyof T, string>
>(
  navigation: NavigationProps["navigation"],
  routeName: K,
  params?: T[K]
): (() => void) => (): void => {
  navigation.reset({
    index: 1,
    routes: [{ name: "CollectCustomerDetailsScreen" }, { name, params }]
  });
};
