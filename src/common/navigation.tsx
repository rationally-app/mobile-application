import { NavigationProps } from "../types";
import {
  StackActions,
  NavigationActions,
  NavigationReplaceActionPayload
} from "react-navigation";

export const replaceRouteFn = (
  navigation: NavigationProps["navigation"],
  routeName: string,
  params?: NavigationReplaceActionPayload["params"]
): (() => boolean) => (): boolean => {
  const action = StackActions.replace({ routeName, params });
  return navigation.dispatch(action);
};

// This resets the entire stack and puts the navigated route right on top of the home page
export const resetRouteFn = (
  navigation: NavigationProps["navigation"],
  routeName: string,
  params?: NavigationReplaceActionPayload["params"]
): (() => boolean) => (): boolean => {
  const action = StackActions.reset({
    index: 1,
    actions: [
      NavigationActions.navigate({ routeName: "CollectCustomerDetailsScreen" }),
      NavigationActions.navigate({ routeName, params })
    ]
  });
  return navigation.dispatch(action);
};

export const pushRoute = (
  navigation: NavigationProps["navigation"],
  routeName: string,
  params?: NavigationReplaceActionPayload["params"]
): boolean => {
  const action = StackActions.push({
    routeName: routeName,
    params: params
  });
  return navigation.dispatch(action);
};

export const navigateHome = (
  navigation: NavigationProps["navigation"]
): boolean => {
  const action = StackActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({ routeName: "CollectCustomerDetailsScreen" })
    ]
  });
  return navigation.dispatch(action);
};
