import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { DocumentListScreenContainer } from "./DocumentListScreenContainer";
import {
  MockDbProvider,
  whenDbSubscriptionReturns,
  resetDb
} from "../../test/helpers/db";
import { mockNavigation, resetNavigation } from "../../test/helpers/navigation";
import demoDoc1 from "../../../fixtures/demo-caas.json";
import demoDoc2 from "../../../fixtures/demo-oc.json";

jest.mock("../../common/navigation");

const sampleDocuments = [
  {
    id: "doc-1",
    created: Date.now(),
    document: demoDoc1,
    isVerified: true
  },
  {
    id: "doc-2",
    created: Date.now(),
    document: demoDoc2,
    isVerified: true
  }
];

describe("DocumentListScreenContainer", () => {
  beforeEach(() => {
    resetDb();
    resetNavigation();
  });

  it("should fetch documents from db and render it as DocumentListItem", () => {
    expect.assertions(2);
    const { queryAllByTestId } = render(
      <MockDbProvider>
        <DocumentListScreenContainer navigation={mockNavigation} />
      </MockDbProvider>
    );
    whenDbSubscriptionReturns(sampleDocuments);
    expect(queryAllByTestId("document-list-item")).not.toBeNull();
    expect(queryAllByTestId("document-list-item")).toHaveLength(2);
  });

  it("should show EmptyDocumentList if no documents are in db", () => {
    expect.assertions(1);
    const { queryByTestId } = render(
      <MockDbProvider>
        <DocumentListScreenContainer navigation={mockNavigation} />
      </MockDbProvider>
    );
    whenDbSubscriptionReturns([]);
    expect(queryByTestId("empty-document-list")).not.toBeNull();
  });

  it("should show LoadingView if db query hasn't finished", () => {
    expect.assertions(1);
    const { queryByTestId } = render(
      <MockDbProvider>
        <DocumentListScreenContainer navigation={mockNavigation} />
      </MockDbProvider>
    );
    expect(queryByTestId("loading-view")).not.toBeNull();
  });

  it("should navigate to LocalDocumentScreen when DocumentListItem is pressed", () => {
    expect.assertions(1);
    const { queryAllByTestId } = render(
      <MockDbProvider>
        <DocumentListScreenContainer navigation={mockNavigation} />
      </MockDbProvider>
    );
    whenDbSubscriptionReturns(sampleDocuments);
    fireEvent.press(queryAllByTestId("document-list-item")[1]);
    expect(mockNavigation.navigate).toHaveBeenCalledWith(
      "LocalDocumentScreen",
      {
        id: "doc-2"
      }
    );
  });

  it("should navigate to QrScannerScreen when db is empty and add is pressed", () => {
    expect.assertions(1);
    const { getByText } = render(
      <MockDbProvider>
        <DocumentListScreenContainer navigation={mockNavigation} />
      </MockDbProvider>
    );
    whenDbSubscriptionReturns([]);
    fireEvent.press(getByText("Scan to add"));
    expect(mockNavigation.dispatch).toHaveBeenCalledWith({
      routeName: "QrScannerScreen",
      type: "Navigation/REPLACE"
    });
  });
});
