import React from "react";
import { storiesOf } from "@storybook/react-native";
import { View } from "react-native";
import { size } from "../../../src/common/styles";
import { LoginOTPCard } from "../../../src/components/Login/LoginOTPCard";

storiesOf("Login", module).add("OTPCard", () => (
  <View style={{ margin: size(3) }}>
    <LoginOTPCard
      resetStage={() => null}
      fullMobileNumber={"+65 8888 8888"}
      operatorToken={"operatorToken"}
      endpoint={"endpoint"}
      handleRequestOTP={() => Promise.resolve(true)}
      onSuccess={() => null}
    />
  </View>
));
