import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { ScannedDocumentActionSheet } from "./index";
import { CheckStatus } from "../../Validity";

jest.mock("../../../common/hooks/useDocumentVerifier");
jest.useFakeTimers();

const validStatus = {
  tamperedCheck: CheckStatus.VALID,
  issuedCheck: CheckStatus.VALID,
  revokedCheck: CheckStatus.VALID,
  issuerCheck: CheckStatus.VALID,
  overallValidity: CheckStatus.VALID
};

describe("ScannedDocumentActionSheet", () => {
  it("should render the issuing entity's identifier", () => {
    expect.assertions(1);
    const { getByText } = render(
      <ScannedDocumentActionSheet
        issuedBy="foobar"
        isSavable={false}
        verificationStatuses={validStatus}
      />
    );
    expect(getByText("foobar")).not.toBeNull();
  });
  it("should render the validity banner", () => {
    expect.assertions(1);
    const { getByTestId } = render(
      <ScannedDocumentActionSheet
        issuedBy="foobar"
        isSavable={false}
        verificationStatuses={validStatus}
      />
    );
    expect(getByTestId("validity-banner")).not.toBeNull();
  });
  it("should not render the save button when document is not savable", () => {
    expect.assertions(1);
    const { queryByText } = render(
      <ScannedDocumentActionSheet
        issuedBy="foobar"
        isSavable={false}
        verificationStatuses={validStatus}
      />
    );
    expect(queryByText("Save")).toBeNull();
  });
  it("should render the done button when document is unsavable", () => {
    expect.assertions(1);
    const { getByText } = render(
      <ScannedDocumentActionSheet
        issuedBy="foobar"
        isSavable={false}
        verificationStatuses={validStatus}
      />
    );
    expect(getByText("Done")).not.toBeNull();
  });
  it("should render the save button when document is savable", () => {
    expect.assertions(1);
    const { getByText } = render(
      <ScannedDocumentActionSheet
        issuedBy="foobar"
        isSavable={true}
        verificationStatuses={validStatus}
      />
    );
    expect(getByText("Save")).not.toBeNull();
  });
  it("should render the cancel button when document is savable", () => {
    expect.assertions(1);
    const { getByText } = render(
      <ScannedDocumentActionSheet
        issuedBy="foobar"
        isSavable={true}
        verificationStatuses={validStatus}
      />
    );
    expect(getByText("Cancel")).not.toBeNull();
  });
  it("should trigger onSave when the save button is pressed (savable doc)", () => {
    expect.assertions(1);
    const onSave = jest.fn();
    const { getByText } = render(
      <ScannedDocumentActionSheet
        issuedBy="foobar"
        isSavable={true}
        onSave={onSave}
        verificationStatuses={validStatus}
      />
    );
    fireEvent.press(getByText("Save"));
    expect(onSave).toHaveBeenCalledTimes(1);
  });
  it("should trigger onCancel when the cancel button is pressed (savable doc)", () => {
    expect.assertions(1);
    const onCancel = jest.fn();
    const { getByText } = render(
      <ScannedDocumentActionSheet
        issuedBy="foobar"
        isSavable={true}
        onCancel={onCancel}
        verificationStatuses={validStatus}
      />
    );
    fireEvent.press(getByText("Cancel"));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
  it("should trigger onDone when the done button is pressed (unsavable doc)", () => {
    expect.assertions(1);
    const onDone = jest.fn();
    const { getByText } = render(
      <ScannedDocumentActionSheet
        issuedBy="foobar"
        isSavable={false}
        onDone={onDone}
        verificationStatuses={validStatus}
      />
    );
    fireEvent.press(getByText("Done"));
    expect(onDone).toHaveBeenCalledTimes(1);
  });
});
