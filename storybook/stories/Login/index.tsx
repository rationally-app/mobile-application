import React from "react";
import { storiesOf } from "@storybook/react-native";
import { View } from "react-native";
import { size } from "../../../src/common/styles";
import { LoginMobileNumberCard } from "../../../src/components/Login/LoginMobileNumberCard";
import { LoginOTPCard } from "../../../src/components/Login/LoginOTPCard";
import { LoginScanCard } from "../../../src/components/Login/LoginScanCard";
import { AppText } from "../../../src/components/Layout/AppText";

storiesOf("Login", module)
  .add("MobileNumberCard", () => (
    <View style={{ margin: size(3) }} key="0">
      <LoginMobileNumberCard
        key="1"
        handleRequestOTP={() => Promise.resolve(true)}
        setMobileNumber={(num) => alert(num)}
        setLoginStage={() => null}
        setCountryCode={() => null}
      />
    </View>
  ))
  .add("OTPCard", () => (
    <View style={{ margin: size(3) }} key="2">
      <LoginOTPCard
        key="3"
        resetStage={() => null}
        fullMobileNumber={"+65 8888 8888"}
        operatorToken={"operatorToken"}
        endpoint={"endpoint"}
        handleRequestOTP={() => Promise.resolve(true)}
        onSuccess={() => null}
      />
    </View>
  ))
  .add("LoginScanCard", () => (
    <View style={{ margin: size(3) }} key="5">
      <LoginScanCard onToggleScanner={() => null} isLoading={false} />
      <View style={{ marginVertical: size(3) }}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginBottom: size(1),
          }}
        >
          <AppText> Loading state is true</AppText>
        </View>
        <LoginScanCard onToggleScanner={() => null} isLoading={true} />
      </View>
    </View>
  ));
