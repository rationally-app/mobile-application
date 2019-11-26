import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { DocumentRenderer } from "./DocumentRenderer";
import sampleDoc from "../../../fixtures/demo-oc.json";
// eslint-disable-next-line jest/no-mocks-import
import { mockTabs, contentOfTab } from "./__mocks__/WebViewFrame";

jest.mock("./WebViewFrame");

describe("DocumentRenderer", () => {
  it("should render header and certificate element", () => {
    expect.assertions(2);
    const { queryByTestId } = render(
      <DocumentRenderer document={sampleDoc} goBack={() => {}} />
    );
    expect(queryByTestId("mock-web-view-frame")).not.toBeNull();
    expect(queryByTestId("header-bar")).not.toBeNull();
  });

  it("should render tabs correctly", () => {
    expect.assertions(2);
    const { queryByText } = render(
      <DocumentRenderer document={sampleDoc} goBack={() => {}} />
    );
    expect(queryByText(mockTabs[0].label)).not.toBeNull();
    expect(queryByText(mockTabs[1].label)).not.toBeNull();
  });

  it("should render content correctly", () => {
    expect.assertions(1);
    const { queryByText } = render(
      <DocumentRenderer document={sampleDoc} goBack={() => {}} />
    );
    expect(queryByText(contentOfTab("tab-1"))).not.toBeNull();
  });

  it("should switch view when tabs are pressed", async () => {
    expect.assertions(4);
    const { getByText, queryByText } = render(
      <DocumentRenderer document={sampleDoc} goBack={() => {}} />
    );
    expect(queryByText(contentOfTab("tab-1"))).not.toBeNull();
    expect(queryByText(contentOfTab("tab-2"))).toBeNull();

    fireEvent.press(getByText(mockTabs[1].label));

    expect(queryByText(contentOfTab("tab-1"))).toBeNull();
    expect(queryByText(contentOfTab("tab-2"))).not.toBeNull();
  });
});
