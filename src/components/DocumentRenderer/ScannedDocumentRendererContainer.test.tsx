import React from "react";
import { render, fireEvent, wait } from "@testing-library/react-native";
import { ScannedDocumentRendererContainer } from "./ScannedDocumentRendererContainer";
import {
  mockNavigation,
  resetNavigation,
  setParam
} from "../../test/helpers/navigation";
import { MockDbProvider, resetDb, mockInsert } from "../../test/helpers/db";
import sampleDocument from "../../../fixtures/demo-caas.json";
import { CheckStatus } from "../../constants/verifier";
import { useDocumentVerifier } from "../../common/hooks/useDocumentVerifier";

jest.mock("../DocumentRenderer/WebViewFrame");
jest.mock("../../common/navigation");
jest.mock("../../common/hooks/useDocumentVerifier");
jest.useFakeTimers();

const mockUseDocumentVerifier = useDocumentVerifier as jest.Mock;

const whenDocumentIsVerified = (): void => {
  mockUseDocumentVerifier.mockReturnValue({
    tamperedCheck: CheckStatus.VALID,
    issuedCheck: CheckStatus.VALID,
    revokedCheck: CheckStatus.VALID,
    issuerCheck: CheckStatus.VALID,
    overallValidity: CheckStatus.VALID
  });
};

describe("ScannedDocumentRendererContainer", () => {
  beforeEach(() => {
    resetNavigation();
    resetDb();
  });

  it("should render DocumentRenderer with document from navigation params", () => {
    expect.assertions(1);
    setParam("document", sampleDocument);
    setParam("savable", false);
    const { queryByTestId } = render(
      <ScannedDocumentRendererContainer navigation={mockNavigation} />
    );
    expect(queryByTestId("mock-web-view-frame")).not.toBeNull();
  });

  it("should render ScannedDocumentActionSheet with save button for savable document", () => {
    expect.assertions(2);
    setParam("document", sampleDocument);
    setParam("savable", true);
    const { queryByText } = render(
      <ScannedDocumentRendererContainer navigation={mockNavigation} />
    );
    expect(queryByText("Save")).not.toBeNull();
    expect(queryByText("Done")).toBeNull();
  });

  it("should render ScannedDocumentActionSheet with done button for unsavable document", () => {
    expect.assertions(2);
    setParam("document", sampleDocument);
    setParam("savable", false);
    const { queryByText } = render(
      <ScannedDocumentRendererContainer navigation={mockNavigation} />
    );
    expect(queryByText("Save")).toBeNull();
    expect(queryByText("Done")).not.toBeNull();
  });

  it("should save and navigate to document to db when save is pressed", async () => {
    expect.assertions(6);
    setParam("document", sampleDocument);
    setParam("savable", true);
    whenDocumentIsVerified();
    const { getByText } = render(
      <MockDbProvider>
        <ScannedDocumentRendererContainer navigation={mockNavigation} />
      </MockDbProvider>
    );
    fireEvent.press(getByText("Save"));
    const insertedDocument = mockInsert.mock.calls[0][0];
    expect(insertedDocument.id).toBe(
      "b40e1ebcbf786e9188b79b13162bfb276df4e7c5d7fef8d944e797766ef8e97a"
    );
    expect(insertedDocument.isVerified).toBe(true);
    expect(insertedDocument.document).toStrictEqual(sampleDocument);
    expect(insertedDocument).toHaveProperty("verified");
    expect(insertedDocument).toHaveProperty("created");
    await wait(() =>
      expect(mockNavigation.dispatch).toHaveBeenCalledWith({
        routeName: "LocalDocumentScreen",
        type: "Navigation/RESET"
      })
    );
  });
});
