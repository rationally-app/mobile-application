import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Tab } from "./TemplateTabs";
import {
  DocumentRendererHeader,
  HeaderBackButton
} from "./DocumentRendererHeader";

const sampleTabs: Tab[] = [
  {
    id: "template-1",
    label: "Template 1"
  },
  {
    id: "template-2",
    label: "Template 2"
  }
];

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

describe("DocumentRendererHeader", () => {
  it("should render both the tabs and back button", () => {
    expect.assertions(3);
    const { queryByText, queryByTestId } = render(
      <DocumentRendererHeader
        goBack={() => {}}
        tabs={sampleTabs}
        tabSelect={() => {}}
        activeTabId="template-2"
      />
    );
    expect(queryByText("Template 1")).not.toBeNull();
    expect(queryByText("Template 2")).not.toBeNull();
    expect(queryByTestId("header-back-button")).not.toBeNull();
  });

  it("should go back when back button is pressed", () => {
    expect.assertions(1);
    const goBack = jest.fn();
    const { getByTestId } = render(
      <DocumentRendererHeader
        goBack={goBack}
        tabs={sampleTabs}
        tabSelect={() => {}}
        activeTabId="template-2"
      />
    );
    fireEvent.press(getByTestId("header-back-button"));
    expect(goBack).toHaveBeenCalledWith();
  });

  it("should select tab when tab is pressed", () => {
    expect.assertions(1);
    const tabSelect = jest.fn();
    const { getByText } = render(
      <DocumentRendererHeader
        goBack={() => {}}
        tabs={sampleTabs}
        tabSelect={tabSelect}
        activeTabId="template-2"
      />
    );
    fireEvent.press(getByText("Template 2"));
    expect(tabSelect).toHaveBeenCalledWith("template-2");
  });
});
