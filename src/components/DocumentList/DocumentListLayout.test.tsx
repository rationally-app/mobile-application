import React from "react";
import { render } from "@testing-library/react-native";
import { DocumentListLayout } from "./DocumentListLayout";

jest.mock("../../common/navigation");

const navigation: any = {};

describe("DocumentListLayout", () => {
  it("should render only EmptyDocumentList and tabs if there is no documents", () => {
    expect.assertions(3);
    const { queryByTestId } = render(
      <DocumentListLayout
        documentItems={[]}
        navigateToDoc={() => true}
        navigateToScanner={() => {}}
        navigation={navigation}
      />
    );
    expect(queryByTestId("empty-document-list")).not.toBeNull();
    expect(queryByTestId("bottom-nav")).not.toBeNull();
    expect(queryByTestId("document-list")).toBeNull();
  });

  it("should render only DocumentList and tabs if there is no documents", () => {
    expect.assertions(3);
    const { queryByTestId } = render(
      <DocumentListLayout
        documentItems={[{ id: "foo", title: "bar" }]}
        navigateToDoc={() => true}
        navigateToScanner={() => {}}
        navigation={navigation}
      />
    );
    expect(queryByTestId("bottom-nav")).not.toBeNull();
    expect(queryByTestId("document-list")).not.toBeNull();
    expect(queryByTestId("empty-document-list")).toBeNull();
  });
});
