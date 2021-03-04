import React from "react";
import { storiesOf } from "@storybook/react-native";
import { AppHeader } from "../../../src/components/Layout/AppHeader";
import { View } from "react-native";
import { size } from "../../../src/common/styles";
import { AppMode } from "../../../src/context/config";

storiesOf("Layout", module).add("AppHeader", () => (
  <View style={{ margin: size(3) }}>
    <View style={{ marginBottom: size(1) }}>
      <AppHeader mode={AppMode.staging} />
    </View>
  </View>
));
