import React from "react";
import { storiesOf } from "@storybook/react-native";
import { AppHeader } from "../../../src/components/Layout/AppHeader";
import { AppText } from "../../../src/components/Layout/AppText";
import { View } from "react-native";
import { size, color } from "../../../src/common/styles";
import { AppMode } from "../../../src/context/config";
import { mockReactNavigationDecorator } from "../mocks/navigation";

const appHeaderElements: JSX.Element[] = [
  <>
    <AppText>Production App Header</AppText>
    <AppHeader />
  </>,
  <>
    <AppText>Staging App Header</AppText>
    <AppHeader mode={AppMode.staging} />
  </>,
];

storiesOf("Layout", module)
  .addDecorator(mockReactNavigationDecorator) // decorator is used to wrapper of the story
  .add("AppHeader", () => (
    <View style={{ margin: size(2) }}>
      {appHeaderElements.map((appHeaderElement, index) => (
        <View
          key={index}
          style={{ marginBottom: size(5), backgroundColor: color("blue", 40) }}
        >
          {appHeaderElement}
        </View>
      ))}
    </View>
  ));
