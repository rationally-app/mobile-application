import { CustomerQuotaStackNavigationProp } from "../types";
import {
  // StackActions,
  NavigationReplaceActionPayload,
} from "react-navigation";

import { StackActions, CommonActions } from "@react-navigation/native";

export const replaceRoute = (
  navigation: CustomerQuotaStackNavigationProp,
  name: string,
  params?: NavigationReplaceActionPayload["params"]
): boolean => {
  return navigation.dispatch(StackActions.replace(name, { params }));
};

// This resets the entire stack and puts the navigated route right on top of the home page
export const resetRoute = (
  navigation: CustomerQuotaStackNavigationProp,
  name: string,
  params?: NavigationReplaceActionPayload["params"]
): boolean => {
  const action = CommonActions.reset({
    index: 1,
    routes: [{ name: "CollectCustomerDetailsScreen" }, { name: name, params }],
  });
  return navigation.dispatch(action);
};

export const pushRoute = (
  navigation: CustomerQuotaStackNavigationProp,
  name: string,
  params?: NavigationReplaceActionPayload["params"]
): boolean => {
  const action = StackActions.push(name, params);
  return navigation.dispatch(action);
};

export const navigateHome = (
  navigation: CustomerQuotaStackNavigationProp
): boolean => {
  const action = CommonActions.reset({
    index: 0,
    routes: [{ name: "CollectCustomerDetailsScreen" }],
  });
  return navigation.dispatch(action);
};
