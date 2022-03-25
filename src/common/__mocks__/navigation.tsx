import { NavigationProps } from "../../types";

export const replaceRouteFn =
  (
    navigation: NavigationProps["navigation"],
    routeName: string
  ): (() => boolean) =>
  (): boolean => {
    // Any casting is required to not provide key
    const action: any = {
      routeName,
      type: "Navigation/REPLACE",
    };
    return navigation.dispatch(action);
  };

export const resetRouteFn =
  (
    navigation: NavigationProps["navigation"],
    routeName: string
  ): (() => boolean) =>
  (): boolean => {
    // Any casting is required to not provide key
    const action: any = {
      routeName,
      type: "Navigation/RESET",
    };
    return navigation.dispatch(action);
  };
