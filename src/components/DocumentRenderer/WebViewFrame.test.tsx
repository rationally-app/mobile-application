import React from "react";
import { render } from "@testing-library/react-native";
import { WebViewFrame } from "./WebViewFrame";
import sampleDoc from "../../../fixtures/demo-oc.json";

describe("WebViewFrame", () => {
  it("should fire setGoToTab to set the function goToTab", () => {
    expect.assertions(1);
    const setGoToTab = jest.fn();
    render(
      <WebViewFrame
        document={sampleDoc}
        setGoToTab={setGoToTab}
        setTabs={() => {}}
        setActiveTabId={() => {}}
      />
    );
    expect(typeof setGoToTab.mock.calls[0][0]).toBe("function");
  });
});
