import React from "react";
import { storiesOf } from "@storybook/react-native";
import { View } from "react-native";
import { size } from "../../../src/common/styles";
import { LoginMobileNumberCard } from "../../../src/components/Login/LoginMobileNumberCard";

storiesOf("Login", module).add("MobileNumberCard", () => (
  <View style={{ margin: size(3) }}>
    <LoginMobileNumberCard
      handleRequestOTP={() => Promise.resolve(true)}
      setMobileNumber={(num) => alert(num)}
      setLoginStage={() => null}
      setCountryCode={() => null}
    />
  </View>
));
