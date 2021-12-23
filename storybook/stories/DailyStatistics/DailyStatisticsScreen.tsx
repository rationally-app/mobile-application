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
import { ThemeContext } from "../../../src/context/theme";
import { govWalletTheme } from "../../../src/common/styles/themes";
import { CampaignPolicy } from "../../../src/types";
import { CampaignConfigContext } from "../../../src/context/campaignConfig";

const products: CampaignPolicy[] = [
  {
    category: "toilet-paper",
    name: "🧻 Toilet Paper",
    description: "",
    order: 1,
    quantity: {
      period: 7,
      limit: 2,
      default: 1,
      unit: {
        type: "POSTFIX",
        label: " roll(s)",
      },
    },
  },
  {
    category: "chocolate",
    name: "🍫 Chocolate",
    order: 2,
    quantity: {
      period: 7,
      limit: 15,
      default: 0,
      unit: {
        type: "POSTFIX",
        label: " bar(s)",
      },
    },
  },
  {
    category: "vouchers",
    name: "🎟 Vouchers",
    description: "",
    order: 1,
    quantity: {
      period: 1,
      limit: 1,
      default: 1,
      unit: {
        type: "POSTFIX",
        label: " qty",
      },
    },
  },
  {
    category: "instant-noodles",
    name: "🍜 Instant Noodles",
    description: "",
    order: 1,
    quantity: {
      period: 1,
      limit: 1,
      default: 1,
      unit: {
        type: "POSTFIX",
        label: " qty",
      },
    },
  },
  {
    category: "store",
    name: "🏢 Store",
    description: "",
    order: 1,
    quantity: {
      period: 1,
      limit: 1,
      default: 1,
      unit: {
        type: "POSTFIX",
        label: " qty",
      },
    },
  },
  {
    category: "store",
    name: "🏢 Store",
    description: "",
    order: 1,
    quantity: {
      period: 1,
      limit: 1,
      default: 1,
      unit: {
        type: "POSTFIX",
        label: " qty",
      },
    },
  },
];

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

storiesOf("Statistics", module)
  .addDecorator((Story: any) => {
    return (
      <ThemeContext.Provider
        value={{
          theme: govWalletTheme,
          setTheme: () => {},
        }}
      >
        <CampaignConfigContext.Provider
          value={{
            policies: products,
            features: null,
            c13n: {
              distributedAmount: "You have recorded",
              lastDistributedTiming: "Last recorded at %{dateTime}",
            },
          }}
        >
          {reactNavigationDecorator(Story)}
        </CampaignConfigContext.Provider>
      </ThemeContext.Provider>
    );
  })
  .add("Screen (GovWallet)", () => (
    <View style={{ height: "100%" }}>
      <DailyStatisticsScreenContainer
        navigation={{
          ...navigation,
          ...{ isFocused: () => null, addListener: () => null },
        }}
      />
    </View>
  ));
