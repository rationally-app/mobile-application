import React from "react";
import { Text } from "react-native";
import { render, fireEvent } from "@testing-library/react-native";
import { BaseButton } from "./BaseButton";

describe("BaseButton", () => {
  it("should render the children", () => {
    expect.assertions(1);
    const children = <Text>Hello World</Text>;
    const { getByText } = render(<BaseButton>{children}</BaseButton>);
    expect(getByText("Hello World")).not.toBeNull();
  });

  it("should fire onPress when children is pressed", () => {
    expect.assertions(1);
    const children = <Text>Hello World</Text>;
    const onPress = jest.fn();
    const { getByText } = render(
      <BaseButton onPress={onPress}>{children}</BaseButton>
    );
    fireEvent.press(getByText("Hello World"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
