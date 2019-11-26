import React from "react";
import { render } from "@testing-library/react-native";
import sampleDoc from "../../../fixtures/demo-oc.json";
import { DocumentDetailsSheet } from "./DocumentDetailsSheet";

describe("DocumentDetailsSheet", () => {
  it("should show the correct issuer name", () => {
    expect.assertions(1);
    const { queryByText } = render(
      <DocumentDetailsSheet document={sampleDoc} />
    );
    expect(queryByText("Govtech")).not.toBeNull();
  });
});
