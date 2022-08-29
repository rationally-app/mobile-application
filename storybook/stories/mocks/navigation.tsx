import React from "react";
import {
  createDrawerNavigator,
  DrawerNavigationOptions,
} from "@react-navigation/drawer";
import { TransitionPresets } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { DrawerNavigationComponent } from "../../../src/components/Layout/DrawerNavigation";
import { RootStackParams } from "../../../src/types";

let params: any = {};

export const navigation: any = {
  navigate: () => alert(`navigate`),
  dispatch: () => alert(`dispatch`),
  goBack: () => alert(`goBack`),
  getParam: (key: string) => params[key],
  addListener: () => alert(`addListener`),
  state: {
    routeName: "routeName",
  },
};

export const resetNavigation = (): void => {
  navigation.navigate.mockReset();
  navigation.dispatch.mockReset();
  navigation.goBack.mockReset();
  params = {};
};

export const setParam = (key: string, value: unknown): void => {
  params[key] = value;
};

export const mockReactNavigationDecorator = (
  story: () => void
): JSX.Element => {
  const Screen = (): any => story();
  const Drawer = createDrawerNavigator();
  const drawerNavigatorScreenOptions: DrawerNavigationOptions = {
    headerShown: false,
    ...TransitionPresets.SlideFromRightIOS,
    drawerPosition: "right",
    drawerType: "slide",
  };

  const Navigator = (
    <NavigationContainer>
      <Drawer.Navigator
        id="StorybookDrawer"
        drawerContent={DrawerNavigationComponent}
        screenOptions={drawerNavigatorScreenOptions}
      >
        <Drawer.Screen
          name={"Story" as keyof RootStackParams}
          component={Screen}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );

  return Navigator;
};
