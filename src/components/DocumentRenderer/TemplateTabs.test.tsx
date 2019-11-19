import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { TemplateTabs, Tab } from "./TemplateTabs";
import { DARK } from "../../common/colors";

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

describe("TemplateTabs", () => {
  it("should render the tabs", () => {
    expect.assertions(2);
    const { queryByText } = render(
      <TemplateTabs
        tabs={sampleTabs}
        tabSelect={() => {}}
        activeTabId="template-2"
      />
    );
    expect(queryByText("Template 1")).not.toBeNull();
    expect(queryByText("Template 2")).not.toBeNull();
  });

  it("should style the active and inactive tab", () => {
    expect.assertions(2);
    const { queryAllByTestId } = render(
      <TemplateTabs
        tabs={sampleTabs}
        tabSelect={() => {}}
        activeTabId="template-2"
      />
    );
    const [firstTab, secondTab] = queryAllByTestId("template-tab");

    expect(firstTab).toHaveStyle({
      borderBottomWidth: 2,
      borderBottomColor: "transparent"
    });

    expect(secondTab).toHaveStyle({
      borderBottomWidth: 2,
      borderBottomColor: DARK
    });
  });

  it("should fire tabSelect with tabId when tabs are clicked", () => {
    expect.assertions(1);
    const tabSelect = jest.fn();
    const { getByText } = render(
      <TemplateTabs
        tabs={sampleTabs}
        tabSelect={tabSelect}
        activeTabId="template-2"
      />
    );
    fireEvent.press(getByText("Template 1"));
    expect(tabSelect).toHaveBeenCalledWith("template-1");
  });
});
