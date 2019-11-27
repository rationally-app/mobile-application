import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { DarkButton } from "./DarkButton";

describe("DarkButton", () => {
  it("should render the children", () => {
    expect.assertions(1);
    const { getByText } = render(<DarkButton text="Hello World" />);
    expect(getByText("Hello World")).not.toBeNull();
  });

  it("should fire onPress when children is", () => {
    expect.assertions(1);
    const onPress = jest.fn();
    const { getByText } = render(
      <DarkButton text="Hello World" onPress={onPress} />
    );
    fireEvent.press(getByText("Hello World"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
