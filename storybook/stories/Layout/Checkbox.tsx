import React, { useState, ReactElement } from "react";
import { storiesOf } from "@storybook/react-native";
import { Checkbox } from "../../../src/components/Layout/Checkbox";
import { AppText } from "../../../src/components/Layout/AppText";
import { View } from "react-native";
import { color } from "../../../src/common/styles";

const CheckboxItem = (): ReactElement => {
  const [isChecked, setIsChecked] = useState(false);
  return (
    <Checkbox
      label={<AppText>isChecked: {isChecked.toString()}</AppText>}
      isChecked={isChecked}
      onToggle={setIsChecked}
    />
  );
};

storiesOf("Layout", module).add("Checkbox", () => (
  <View style={{ backgroundColor: color("grey", 10) }}>
    <CheckboxItem />
    <CheckboxItem />
  </View>
));
