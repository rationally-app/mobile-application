import React, { useState } from "react";
import { storiesOf } from "@storybook/react-native";
import { PhoneNumberInput } from "../../../src/components/Layout/PhoneNumberInput";
import { View } from "react-native";
import { size } from "../../../src/common/styles";

const PhoneNumberInputItem = (): JSX.Element => {
  const [countryCodeValue, setCountryCodeValue] = useState("+65");
  const [mobileNumberValue, setMobileNumberValue] = useState("");
  return (
    <View style={{ margin: size(3) }}>
      <PhoneNumberInput
        countryCodeValue={countryCodeValue}
        label="Input label"
        mobileNumberValue={mobileNumberValue}
        onChangeCountryCode={(text) => setCountryCodeValue(text)}
        onChangeMobileNumber={(text) => setMobileNumberValue(text)}
      />
    </View>
  );
};
storiesOf("Layout", module).add("PhoneNumberInput", () => (
  <PhoneNumberInputItem />
));
