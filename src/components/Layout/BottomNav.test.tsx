import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { BottomNav } from "./BottomNav";
import { mockNavigation, resetNavigation } from "../../test/helpers/navigation";
import { color } from "../../common/styles";

jest.mock("../../common/navigation");

describe("BottomNav", () => {
  beforeEach(() => {
    resetNavigation();
  });

  it("should render three tabs", () => {
    // This test will fail if setup.jest.js does not mock the icon
    expect.assertions(1);
    const { queryAllByTestId } = render(
      <BottomNav navigation={mockNavigation} />
    );
    expect(queryAllByTestId("nav-tab")).toHaveLength(3);
  });

  it("should go to `DocumentListScreen` when Home tab is pressed", () => {
    expect.assertions(4);
    mockNavigation.state.routeName = "DocumentListScreen";
    const { queryAllByTestId } = render(
      <BottomNav navigation={mockNavigation} />
    );
    fireEvent.press(queryAllByTestId("nav-tab")[0]);
    expect(mockNavigation.dispatch).toHaveBeenCalledWith({
      routeName: "DocumentListScreen",
      type: "Navigation/REPLACE"
    });
    expect(queryAllByTestId("nav-tab")[0].children[0]).toHaveStyle({
      color: color("orange", 40)
    });
    expect(queryAllByTestId("nav-tab")[1].children[0]).toHaveProp(
      "fill",
      color("grey", 30)
    );
    expect(queryAllByTestId("nav-tab")[2].children[0]).toHaveStyle({
      color: color("grey", 30)
    });
  });

  it("should go to `QrScannerScreen` when QR tab is pressed", () => {
    expect.assertions(4);
    mockNavigation.state.routeName = "QrScannerScreen";
    const { queryAllByTestId } = render(
      <BottomNav navigation={mockNavigation} />
    );
    fireEvent.press(queryAllByTestId("nav-tab")[1]);
    expect(mockNavigation.dispatch).toHaveBeenCalledWith({
      routeName: "QrScannerScreen",
      type: "Navigation/REPLACE"
    });
    expect(queryAllByTestId("nav-tab")[0].children[0]).toHaveStyle({
      color: color("grey", 30)
    });
    expect(queryAllByTestId("nav-tab")[1].children[0]).toHaveProp(
      "fill",
      color("orange", 40)
    );
    expect(queryAllByTestId("nav-tab")[2].children[0]).toHaveStyle({
      color: color("grey", 30)
    });
  });

  it("should go to `SettingsScreen` when Settings tab is pressed", () => {
    expect.assertions(4);
    mockNavigation.state.routeName = "SettingsScreen";
    const { queryAllByTestId } = render(
      <BottomNav navigation={mockNavigation} />
    );
    fireEvent.press(queryAllByTestId("nav-tab")[2]);
    expect(mockNavigation.dispatch).toHaveBeenCalledWith({
      routeName: "SettingsScreen",
      type: "Navigation/REPLACE"
    });

    expect(queryAllByTestId("nav-tab")[0].children[0]).toHaveStyle({
      color: color("grey", 30)
    });
    expect(queryAllByTestId("nav-tab")[1].children[0]).toHaveProp(
      "fill",
      color("grey", 30)
    );
    expect(queryAllByTestId("nav-tab")[2].children[0]).toHaveStyle({
      color: color("orange", 40)
    });
  });
});
