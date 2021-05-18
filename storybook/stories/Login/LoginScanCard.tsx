import React from "react";
import { storiesOf } from "@storybook/react-native";
import { View } from "react-native";
import { size } from "../../../src/common/styles";
import { LoginScanCard } from "../../../src/components/Login/LoginScanCard";
import { AppText } from "../../../src/components/Layout/AppText";

storiesOf("Login", module).add("LoginScanCard", () => (
  <View style={{ margin: size(3) }}>
    {[false, true].map((value, index) => (
      <View style={{ marginVertical: size(3) }} key={index}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginBottom: size(1),
          }}
        >
          <AppText> Loading state is {value.toString()}</AppText>
        </View>
        <LoginScanCard onToggleScanner={() => null} isLoading={value} />
      </View>
    ))}
  </View>
));
