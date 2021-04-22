import React from "react";
import { storiesOf } from "@storybook/react-native";
import { View } from "react-native";
import { createAppContainer } from "react-navigation";
import { createDrawerNavigator } from "react-navigation-drawer";
import { CustomerAppealScreen } from "../../../src/components/CustomerAppeal/CustomerAppealScreen";
import { CampaignConfigContext } from "../../../src/context/campaignConfig";
import { ImportantMessageContentContext } from "../../../src/context/importantMessage";
import { CampaignPolicy } from "../../../src/types";
import { navigation } from "../mocks/navigation";

const products: CampaignPolicy[] = [
  {
    category: "Lost token",
    categoryType: "APPEAL",
    name: "Lost token",
    alert: {
      label: "*chargeable",
      threshold: 7,
    },
    order: 1,
    quantity: {
      period: 7,
      limit: 2,
    },
  },
  {
    category: "Dead battery",
    categoryType: "APPEAL",
    name: "Dead battery",
    order: 2,
    quantity: {
      period: 7,
      limit: 2,
    },
  },
  {
    category: "Damaged token",
    categoryType: "APPEAL",
    name: "Damaged token",
    order: 3,
    quantity: {
      period: 7,
      limit: 2,
    },
  },
];
const reactNavigationDecorator = (story: any): JSX.Element => {
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

storiesOf("CustomerAppeal", module)
  .addDecorator((Story: any) => (
    <CampaignConfigContext.Provider
      value={{
        policies: products,
        features: null,
        c13n: {},
      }}
    >
      <ImportantMessageContentContext.Provider
        value={{
          title: "MessageContent",
        }}
      >
        {reactNavigationDecorator(Story)}
      </ImportantMessageContentContext.Provider>
    </CampaignConfigContext.Provider>
  ))
  .add("Screen", () => {
    return (
      <View>
        <CustomerAppealScreen
          navigation={{ ...navigation, ...{ getParam: () => ["S1412284B"] } }}
        />
      </View>
    );
  });
