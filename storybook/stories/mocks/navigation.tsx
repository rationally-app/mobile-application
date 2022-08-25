import React, { FunctionComponent, version } from "react";
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerNavigationOptions,
} from "@react-navigation/drawer";
import { TransitionPresets } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import {
  BottomNavigationLink,
  DrawerButtonComponent,
  DrawerNavigationComponent,
} from "../../../src/components/Layout/DrawerNavigation";
import { RootStackParams } from "../../../src/types";
import { size } from "lodash";
import { View, TouchableOpacity, ScrollView, Linking } from "react-native";
import { color } from "react-native-reanimated";
import { styles } from "../../../src/components/CustomerQuota/TransactionsGroup";
import { AppText } from "../../../src/components/Layout/AppText";
import { useTranslate } from "../../../src/hooks/useTranslate/useTranslate";

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
