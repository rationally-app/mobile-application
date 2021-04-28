import React from "react";
import { storiesOf } from "@storybook/react-native";
import { View } from "react-native";
import LoginScreen from "../../../src/navigation/LoginScreen";
import { navigation } from "../mocks/navigation";

storiesOf("Screen", module).add("Login", () => (
  <View style={{ height: "100%" }}>
    <LoginScreen navigation={navigation} />
  </View>
));
