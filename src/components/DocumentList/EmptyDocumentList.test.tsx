import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { EmptyDocumentList } from "./EmptyDocumentList";

describe("DefaultDocuentView", () => {
  it("should show the right message", () => {
    expect.assertions(2);
    const { getByText } = render(<EmptyDocumentList onAdd={() => {}} />);
    expect(getByText("Add a new document")).not.toBeNull();
    expect(getByText("to your wallet")).not.toBeNull();
  });

  it("should show the scanner button", () => {
    expect.assertions(1);
    const { getByTestId } = render(<EmptyDocumentList onAdd={() => {}} />);
    expect(getByTestId("scanner-button")).not.toBeNull();
  });

  it("should navigate to scanner when button is pressed", () => {
    expect.assertions(1);
    const onAdd = jest.fn();
    const { getByTestId } = render(<EmptyDocumentList onAdd={onAdd} />);
    fireEvent.press(getByTestId("scanner-button"));
    expect(onAdd).toHaveBeenCalledTimes(1);
  });
});
