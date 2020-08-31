import { NavigationProps } from "../types";
import { StackActions, ParamListBase } from "@react-navigation/native";

//TODO: see if needed or not
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
    routes: [
      { name: "CollectCustomerDetailsScreen" },
      { name: routeName, params: params }
    ]
  });
};

export const pushRoute = <
  T extends ParamListBase,
  K extends Extract<keyof T, string>
>(
  navigation: NavigationProps["navigation"],
  routeName: string,
  params?: T[K]
): (() => void) => (): void => {
  StackActions.push(routeName, params);
};

//TODO: when user goes home, params are gone -> need to find a way to retain params
export const navigateHome = (
  navigation: NavigationProps["navigation"]
): (() => void) => (): void => {
  navigation.reset({
    index: 0,
    routes: [{ name: "CollectCustomerDetailsScreen" }]
  });
};
