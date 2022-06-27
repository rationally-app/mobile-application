import { NavigationProps, RootDrawerParamList } from "../types";
import {
  // StackActions,
  NavigationActions,
  NavigationReplaceActionPayload,
} from "react-navigation";

import { StackActions, CommonActions } from "@react-navigation/native";

export const replaceRoute = (
  navigation: NavigationProps<keyof RootDrawerParamList>["navigation"],
  routeName: string,
  params?: NavigationReplaceActionPayload["params"]
): boolean => {
  return navigation.dispatch(StackActions.replace(routeName, { params }));
};

// This resets the entire stack and puts the navigated route right on top of the home page
export const resetRoute = (
  navigation: NavigationProps<keyof RootDrawerParamList>["navigation"],
  routeName: string,
  params?: NavigationReplaceActionPayload["params"]
): boolean => {
  const action = CommonActions.reset({
    index: 1,
    actions: [
      { name: "CollectCustomerDetailsScreen" },
      { name: routeName, params },
    ],
  });
  return navigation.dispatch(action);
};

export const pushRoute = (
  navigation: NavigationProps<keyof RootDrawerParamList>["navigation"],
  routeName: string,
  params?: NavigationReplaceActionPayload["params"]
): boolean => {
  const action = StackActions.push(routeName, params);
  return navigation.dispatch(action);
};

export const navigateHome = (
  navigation: NavigationProps<keyof RootDrawerParamList>["navigation"]
): boolean => {
  const action = StackActions.reset({
    index: 0,
    routes: [{ name: "CollectCustomerDetailsScreen" }],
  });
  return navigation.dispatch(action);
};
