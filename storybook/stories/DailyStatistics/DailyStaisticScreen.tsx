import React from "react";
import { storiesOf } from "@storybook/react-native";
import { View } from "react-native";
import { DailyStatisticsScreenContainer } from "../../../src/components/DailyStatistics/DailyStatisticsScreen";
import { navigation } from "../mocks/navigation";
import { createAppContainer } from "react-navigation";
import { createDrawerNavigator } from "react-navigation-drawer";
import {
  createStackNavigator,
  StackViewTransitionConfigs,
} from "react-navigation-stack";

const reactNavigationDecorator = (story: any): JSX.Element => {
  const Screen = (): any => story();
  const Stack = createAppContainer(
    createStackNavigator(
      {
        Screen,
      },
      {
        headerMode: "none",
        transitionConfig: () => StackViewTransitionConfigs.SlideFromRightIOS,
        navigationOptions: {
          gesturesEnabled: true,
        },
      }
    )
  );
  const Navigator = createAppContainer(
    createDrawerNavigator(
      {
        Stack,
      },
      {
        drawerPosition: "right",
        drawerType: "slide",
      }
    )
  );
  return <Navigator />;
};

storiesOf("Statistics", module)
  .addDecorator((Story: any) => reactNavigationDecorator(Story))
  .add("Screen", () => (
    <View style={{ height: "100%" }}>
      <DailyStatisticsScreenContainer
        navigation={{
          ...navigation,
          ...{ isFocused: () => null, addListener: () => null },
        }}
      />
    </View>
  ));
