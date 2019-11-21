import React from "react";
import { Text } from "react-native";
import { render, fireEvent } from "@testing-library/react-native";
import { HeaderBackButton, Header } from "./Header";

describe("HeaderBackButton", () => {
  it("should render", () => {
    // This test will fail if setup.jest.js does not mock the icon
    expect.assertions(1);
    const { queryByTestId } = render(<HeaderBackButton onPress={() => {}} />);
    expect(queryByTestId("header-back-button")).not.toBeNull();
  });

  it("should fire onPress when pressed", () => {
    expect.assertions(1);
    const onPress = jest.fn();
    const { getByTestId } = render(<HeaderBackButton onPress={onPress} />);
    fireEvent.press(getByTestId("header-back-button"));
    expect(onPress).toHaveBeenCalledWith();
  });
});

describe("Header", () => {
  it("should render both child element and back button when provided", () => {
    expect.assertions(2);
    const { queryByTestId, queryByText } = render(
      <Header goBack={() => {}}>
        <Text>Hello World</Text>
      </Header>
    );
    expect(queryByTestId("header-back-button")).not.toBeNull();
    expect(queryByText("Hello World")).not.toBeNull();
  });

  it("should render just the back button if there is no children", () => {
    expect.assertions(1);
    const { queryByTestId } = render(<Header goBack={() => {}} />);
    expect(queryByTestId("header-back-button")).not.toBeNull();
  });

  it("should not render back button when goBack is not provided", () => {
    expect.assertions(1);
    const { queryByTestId } = render(<Header />);
    expect(queryByTestId("header-back-button")).toBeNull();
  });
});
