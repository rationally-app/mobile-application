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
import { DocumentDetailsSheet } from "./DocumentDetailsSheet";
import { CheckStatus } from "../Validity";

jest.mock("../DocumentRenderer/WebViewFrame");
jest.mock("../../common/navigation");

let sheetProps: DocumentDetailsSheet;
jest.mock("./DocumentDetailsSheet", () => ({
  DocumentDetailsSheet: (props: DocumentDetailsSheet) => {
    sheetProps = { ...props };
    return null;
  }
}));

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

  it("should update the document when document is determined to be valid", async () => {
    expect.assertions(2);
    const atomicUpdate = jest.fn();
    const document = {
      document: sampleDocument,
      isVerified: false,
      verified: 1,
      atomicUpdate
    };
    render(
      <MockDbProvider>
        <LocalDocumentRendererContainer navigation={mockNavigation} />
      </MockDbProvider>
    );
    whenDbSubscriptionReturns(document);
    await wait(() => {
      sheetProps.onVerification(CheckStatus.VALID);
      expect(atomicUpdate).toHaveBeenCalledTimes(1);

      // Call the update on the old document
      atomicUpdate.mock.calls[0][0](document);
      expect(document).toHaveProperty("isVerified", true);
    });
  });

  it("should update the document when document is determined to be invalid", async () => {
    expect.assertions(2);
    const atomicUpdate = jest.fn();
    const document = {
      document: sampleDocument,
      isVerified: false,
      verified: 1,
      atomicUpdate
    };
    render(
      <MockDbProvider>
        <LocalDocumentRendererContainer navigation={mockNavigation} />
      </MockDbProvider>
    );
    whenDbSubscriptionReturns(document);
    await wait(() => {
      sheetProps.onVerification(CheckStatus.INVALID);
      expect(atomicUpdate).toHaveBeenCalledTimes(1);

      // Call the update on the old document
      atomicUpdate.mock.calls[0][0](document);
      expect(document).toHaveProperty("isVerified", false);
    });
  });
});
