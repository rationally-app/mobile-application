import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { LocalDocumentRendererContainer } from "./LocalDocumentRendererContainer";
import {
  MockDbProvider,
  whenDbSubscriptionReturns,
  resetDb
} from "../../test/helpers/db";
import { mockNavigation, resetNavigation } from "../../test/helpers/navigation";
import sampleDocument from "../../../fixtures/demo-caas.json";

jest.mock("../DocumentRenderer/WebViewFrame");
jest.mock("../../common/navigation");
jest.useFakeTimers();

describe("LocalDocumentRendererContainer", () => {
  beforeEach(() => {
    resetDb();
    resetNavigation();
  });

  it("should show loading screen before document is loaded from db", () => {
    expect.assertions(2);
    const { queryByTestId } = render(
      <MockDbProvider>
        <LocalDocumentRendererContainer navigation={mockNavigation} />
      </MockDbProvider>
    );
    expect(queryByTestId("mock-web-view-frame")).toBeNull();
    expect(queryByTestId("loading-view")).not.toBeNull();
  });

  it("should get the document from db and render it", () => {
    expect.assertions(2);
    const { queryByTestId } = render(
      <MockDbProvider>
        <LocalDocumentRendererContainer navigation={mockNavigation} />
      </MockDbProvider>
    );
    whenDbSubscriptionReturns({ document: sampleDocument });
    expect(queryByTestId("loading-view")).toBeNull();
    expect(queryByTestId("mock-web-view-frame")).not.toBeNull();
  });

  it("should allow navigation back", () => {
    expect.assertions(1);
    const { getByTestId } = render(
      <MockDbProvider>
        <LocalDocumentRendererContainer navigation={mockNavigation} />
      </MockDbProvider>
    );
    whenDbSubscriptionReturns({ document: sampleDocument });
    fireEvent.press(getByTestId("header-back-button"));
    expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
  });
});
