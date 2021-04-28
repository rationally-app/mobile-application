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
    <View style={{ margin: size(3) }} key="10">
      <LoginMobileNumberCard
        key="11"
        handleRequestOTP={() => Promise.resolve(true)}
        setMobileNumber={(num) => alert(num)}
        setLoginStage={() => null}
        setCountryCode={() => null}
      />
    </View>
  ))
  .add("OTPCard", () => (
    <View style={{ margin: size(3) }} key="20">
      <LoginOTPCard
        key="21"
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
    <View style={{ margin: size(3) }} key="30">
      {[false, true].map((value, index) => (
        <View style={{ marginVertical: size(3) }} key={index + 31}>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginBottom: size(1),
            }}
          >
            <AppText> Loading state is {value.toString()}</AppText>
          </View>
          <LoginScanCard
            key={index * 2}
            onToggleScanner={() => null}
            isLoading={value}
          />
        </View>
      ))}
    </View>
  ));
