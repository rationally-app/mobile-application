import React from "react";
import { storiesOf } from "@storybook/react-native";
import { View } from "react-native";
import { InitialisationContainer } from "../../../src/components/Login/LoginContainer";
import { navigation } from "../mocks/navigation";

storiesOf("Screen", module).add("LoginScreen", () => (
  <View style={{ height: "100%" }}>
    <InitialisationContainer route={{} as any} navigation={navigation} />
  </View>
));
