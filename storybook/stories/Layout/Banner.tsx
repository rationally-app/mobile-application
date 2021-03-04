import React from "react";
import { storiesOf } from "@storybook/react-native";
import { Banner } from "../../../src/components/Layout/Banner";
import { View } from "react-native";
import { size } from "../../../src/common/styles";

const bannerElements = (): JSX.Element[] => {
  return [
    <Banner key="0" title="Title" />,
    <Banner key="1" title="Title" description="Description" />,
    <Banner
      key="2"
      title="Title"
      description="Description,icon"
      featherIconName="smile"
    />,
    <Banner
      key="3"
      title="Title"
      description="Description,icon,action"
      featherIconName="smile"
      action={{ label: "Action", callback: () => null }}
    />,
  ];
};

storiesOf("Layout", module).add("Banner", () => (
  <View style={{ margin: size(3) }}>
    {bannerElements().map((bannerElement, index) => (
      <View key={index} style={{ marginBottom: size(1) }}>
        {bannerElement}
      </View>
    ))}
  </View>
));
