import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { BottomNav } from "./BottomNav";

jest.mock("../../common/navigation");

describe("BottomNav", () => {
  it("should render three tabs", () => {
    // This test will fail if setup.jest.js does not mock the icon
    expect.assertions(1);
    const mockNavigation: any = { dispatch: jest.fn() };
    const { queryAllByTestId } = render(
      <BottomNav navigation={mockNavigation} />
    );
    expect(queryAllByTestId("nav-tab")).toHaveLength(3);
  });

  it("should go to `DocumentListScreen` when Home tab is pressed", () => {
    expect.assertions(1);
    const mockNavigation: any = { dispatch: jest.fn() };
    const { queryAllByTestId } = render(
      <BottomNav navigation={mockNavigation} />
    );
    fireEvent.press(queryAllByTestId("nav-tab")[0]);
    expect(mockNavigation.dispatch).toHaveBeenCalledWith({
      routeName: "DocumentListScreen",
      type: "Navigation/REPLACE"
    });
  });

  it("should go to `QrScannerScreen` when QR tab is pressed", () => {
    expect.assertions(1);
    const mockNavigation: any = { dispatch: jest.fn() };
    const { queryAllByTestId } = render(
      <BottomNav navigation={mockNavigation} />
    );
    fireEvent.press(queryAllByTestId("nav-tab")[1]);
    expect(mockNavigation.dispatch).toHaveBeenCalledWith({
      routeName: "QrScannerScreen",
      type: "Navigation/REPLACE"
    });
  });
});
