import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Settings } from "./Settings";
import { mockNavigation, resetNavigation } from "../../test/helpers/navigation";

jest.mock("expo-constants", () => ({ manifest: { revisionId: "BUILD NO" } }));
jest.mock("../../common/navigation");

describe("Settings", () => {
  beforeEach(() => {
    resetNavigation();
  });
  it("should render the header", () => {
    expect.assertions(2);
    const { queryByText, queryByTestId } = render(
      <Settings onResetDocumentData={() => {}} navigation={mockNavigation} />
    );
    expect(queryByText("Settings")).not.toBeNull();
    expect(queryByTestId("header-bar")).not.toBeNull();
  });
  it("should render the build no", () => {
    expect.assertions(2);
    const { queryByText, queryByTestId } = render(
      <Settings onResetDocumentData={() => {}} navigation={mockNavigation} />
    );
    expect(queryByText("BUILD NO")).not.toBeNull();
    expect(queryByTestId("build-no")).not.toBeNull();
  });
  it("should render the bottom nav", () => {
    expect.assertions(1);
    const { queryByTestId } = render(
      <Settings onResetDocumentData={() => {}} navigation={mockNavigation} />
    );
    expect(queryByTestId("bottom-nav")).not.toBeNull();
  });
  it("should fire onResetDocumentData when delete is pressed", () => {
    expect.assertions(1);
    const mockOnResetDocumentData = jest.fn();
    const { getByText } = render(
      <Settings
        onResetDocumentData={mockOnResetDocumentData}
        navigation={mockNavigation}
      />
    );
    fireEvent.press(getByText("Delete"));
    expect(mockOnResetDocumentData).toHaveBeenCalledTimes(1);
  });
  it("should navigate to DocumentListScreen on bottom nav", () => {
    expect.assertions(1);
    const { getAllByTestId } = render(
      <Settings onResetDocumentData={() => {}} navigation={mockNavigation} />
    );
    fireEvent.press(getAllByTestId("nav-tab")[0]);
    expect(mockNavigation.dispatch).toHaveBeenCalledWith({
      routeName: "DocumentListScreen",
      type: "Navigation/REPLACE"
    });
  });
  it("should navigate to QrScannerScreen on bottom nav", () => {
    expect.assertions(1);
    const { getAllByTestId } = render(
      <Settings onResetDocumentData={() => {}} navigation={mockNavigation} />
    );
    fireEvent.press(getAllByTestId("nav-tab")[1]);
    expect(mockNavigation.dispatch).toHaveBeenCalledWith({
      routeName: "QrScannerScreen",
      type: "Navigation/REPLACE"
    });
  });
});
