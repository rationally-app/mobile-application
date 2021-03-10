import React from "react";
import { storiesOf } from "@storybook/react-native";
import { AppHeader } from "../../../src/components/Layout/AppHeader";
import { View, Text } from "react-native";
import { size, color } from "../../../src/common/styles";
import { AppMode } from "../../../src/context/config";
import { createAppContainer } from "react-navigation";
import { createDrawerNavigator } from "react-navigation-drawer";

const reactNavigationDecorator = (story: any): any => {
  const Screen = (): any => story();
  const Navigator = createAppContainer(
    createDrawerNavigator(
      { Screen },
      {
        drawerPosition: "right",
        drawerType: "slide",
      }
    )
  );
  return <Navigator />;
};

const appHeaderElements = (): any[] => {
  return [
    <>
      <Text>Production App Header</Text>
      <AppHeader />
    </>,
    <>
      <Text>Staging App Header</Text>
      <AppHeader mode={AppMode.staging} />
    </>,
  ];
};

storiesOf("Layout", module)
  .addDecorator(reactNavigationDecorator) // decorator is used to wrapper of the story
  .add("AppHeader", () => (
    <View style={{ margin: size(2), backgroundColor: color("blue", 40) }}>
      {appHeaderElements().map((appHeaderElement, index) => (
        <View key={index} style={{ marginBottom: size(2) }}>
          {appHeaderElement}
        </View>
      ))}
    </View>
  ));
