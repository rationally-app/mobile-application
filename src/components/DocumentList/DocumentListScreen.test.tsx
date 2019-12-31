import React from "react";
import { render } from "@testing-library/react-native";
import { DocumentListScreen } from "./DocumentListScreen";
import { mockNavigation } from "../../test/helpers/navigation";

jest.mock("../../common/navigation");

describe("DocumentListScreen", () => {
  it("should render only loading view and nav when documents is undefined", () => {
    expect.assertions(4);
    const { queryByTestId } = render(
      <DocumentListScreen
        navigateToDoc={() => true}
        navigateToScanner={() => {}}
        navigation={mockNavigation}
      />
    );
    expect(queryByTestId("document-list")).toBeNull();
    expect(queryByTestId("empty-document-list")).toBeNull();
    expect(queryByTestId("loading-view")).not.toBeNull();
    expect(queryByTestId("bottom-nav")).not.toBeNull();
  });

  it("should render only EmptyDocumentList and nav when there are no documents", () => {
    expect.assertions(4);
    const { queryByTestId } = render(
      <DocumentListScreen
        documentItems={[]}
        navigateToDoc={() => true}
        navigateToScanner={() => {}}
        navigation={mockNavigation}
      />
    );
    expect(queryByTestId("document-list")).toBeNull();
    expect(queryByTestId("empty-document-list")).not.toBeNull();
    expect(queryByTestId("loading-view")).toBeNull();
    expect(queryByTestId("bottom-nav")).not.toBeNull();
  });

  it("should render only DocumentList and nav when there are documents", () => {
    expect.assertions(4);
    const { queryByTestId } = render(
      <DocumentListScreen
        documentItems={[{ id: "foo", title: "bar" }]}
        navigateToDoc={() => true}
        navigateToScanner={() => {}}
        navigation={mockNavigation}
      />
    );
    expect(queryByTestId("document-list")).not.toBeNull();
    expect(queryByTestId("empty-document-list")).toBeNull();
    expect(queryByTestId("loading-view")).toBeNull();
    expect(queryByTestId("bottom-nav")).not.toBeNull();
  });
});
