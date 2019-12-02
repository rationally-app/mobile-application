import React from "react";
import { render, wait } from "@testing-library/react-native";
import sampleDoc from "../../../fixtures/demo-oc.json";
import { DocumentDetailsSheet } from "./DocumentDetailsSheet";

import { useDocumentVerifier } from "../../common/hooks/useDocumentVerifier";
jest.mock("../../common/hooks/useDocumentVerifier");
const mockUseVerifier = useDocumentVerifier as jest.Mock;

jest.useFakeTimers();

describe("DocumentDetailsSheet", () => {
  it("should show the correct issuer name", async () => {
    expect.assertions(1);
    mockUseVerifier.mockReturnValue({});
    const { queryByText } = render(
      <DocumentDetailsSheet document={sampleDoc} />
    );
    await wait(() => {
      expect(queryByText("Govtech")).not.toBeNull();
    });
  });
});
