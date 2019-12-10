import React from "react";
import { render, fireEvent, wait } from "@testing-library/react-native";
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

  it("should show loading screen before document is loaded from db", async () => {
    expect.assertions(2);
    const { queryByTestId } = render(
      <MockDbProvider>
        <LocalDocumentRendererContainer navigation={mockNavigation} />
      </MockDbProvider>
    );

    await wait(() => {
      expect(queryByTestId("mock-web-view-frame")).toBeNull();
      expect(queryByTestId("loading-view")).not.toBeNull();
    });
  });

  it("should get the document from db and render it", async () => {
    expect.assertions(2);
    const { queryByTestId } = render(
      <MockDbProvider>
        <LocalDocumentRendererContainer navigation={mockNavigation} />
      </MockDbProvider>
    );
    whenDbSubscriptionReturns({ document: sampleDocument });

    await wait(() => {
      expect(queryByTestId("loading-view")).toBeNull();
      expect(queryByTestId("mock-web-view-frame")).not.toBeNull();
    });
  });

  it("should allow navigation back", async () => {
    expect.assertions(1);
    const { getByTestId } = render(
      <MockDbProvider>
        <LocalDocumentRendererContainer navigation={mockNavigation} />
      </MockDbProvider>
    );
    whenDbSubscriptionReturns({ document: sampleDocument });
    fireEvent.press(getByTestId("header-back-button"));
    await wait(() => {
      expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
    });
  });
});
