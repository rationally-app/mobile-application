import React from "react";
import { storiesOf } from "@storybook/react-native";
import { LightBox } from "../../../src/components/Layout/LightBox";
import { AppText } from "../../../src/components/Layout/AppText";
import { View } from "react-native";

storiesOf("Layout", module).add("LightBox", () => (
  <View>
    <LightBox
      width={200}
      height={200}
      label={<AppText>Box size (200,200)</AppText>}
    />
  </View>
));
