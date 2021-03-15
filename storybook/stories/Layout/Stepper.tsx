import React, { useState, FunctionComponent } from "react";
import { storiesOf } from "@storybook/react-native";
import { Stepper } from "../../../src/components/Layout/Stepper";
import { View } from "react-native";
import { size } from "../../../src/common/styles";

const StepperItem: FunctionComponent<{
  initialValue?: Stepper["value"];
  step?: Stepper["step"];
  bounds?: Stepper["bounds"];
  unit?: Stepper["unit"];
}> = ({ initialValue = 0, step, bounds, unit }) => {
  const [value, setValue] = useState(initialValue);
  return (
    <Stepper
      value={value}
      setValue={setValue}
      step={step}
      bounds={bounds}
      unit={unit}
    />
  );
};

const stepperElements: JSX.Element[] = [
  <StepperItem key={0} />,
  <StepperItem initialValue={990} step={10} key={1} />,
  <StepperItem
    initialValue={10}
    step={10}
    bounds={{ min: 10, max: 30 }}
    key={2}
  />,
  <StepperItem
    initialValue={10}
    step={10}
    bounds={{ min: 10, max: 30 }}
    unit={{
      type: "POSTFIX",
      label: "kg",
    }}
    key={3}
  />,
  <StepperItem
    initialValue={10}
    step={5}
    bounds={{ min: 10, max: 30 }}
    unit={{
      type: "PREFIX",
      label: "$",
    }}
    key={4}
  />,
];

storiesOf("Layout", module).add("Stepper", () => (
  <View style={{ flex: 1, alignItems: "center", marginTop: size(6) }}>
    {stepperElements.map((stepperElement, index) => (
      <View key={index} style={{ margin: size(1) }}>
        {stepperElement}
      </View>
    ))}
  </View>
));
