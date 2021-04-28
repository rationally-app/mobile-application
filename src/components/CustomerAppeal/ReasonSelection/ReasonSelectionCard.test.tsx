import { render, fireEvent, cleanup } from "@testing-library/react-native";
import React from "react";
import { Reason, ReasonSelectionCard } from "./ReasonSelectionCard";
import "../../../common/i18n/i18nMock";

const onCancel = jest.fn();
const onReasonSelection = jest.fn();
const mockReasons: Reason[] = [
  { description: "reason-a", descriptionAlert: "*alert-a" },
  { description: "reason-b", descriptionAlert: undefined },
  { description: "reason-c", descriptionAlert: undefined },
];

describe("ReasonSelectionCard", () => {
  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
  });

  it("should render the reasons correctly", async () => {
    expect.assertions(7);
    const { queryByText } = render(
      <ReasonSelectionCard
        ids={["S0000001I"]}
        reasonSelectionHeader={"Indicate reason for appeal"}
        reasons={mockReasons}
        onCancel={onCancel}
        onReasonSelection={onReasonSelection}
      />
    );

    const reasonDescriptionA = queryByText("reason-a");
    const reasonDescriptionB = queryByText("reason-b");
    const reasonDescriptionC = queryByText("reason-c");
    const reasonDescriptionAlertA = queryByText("*alert-a");

    expect(reasonDescriptionA!).not.toBeNull();
    expect(reasonDescriptionB!).not.toBeNull();
    expect(reasonDescriptionC!).not.toBeNull();
    expect(reasonDescriptionAlertA).not.toBeNull();

    fireEvent.press(reasonDescriptionA!);
    expect(onReasonSelection).toHaveBeenCalledTimes(1);

    fireEvent.press(reasonDescriptionB!);
    expect(onReasonSelection).toHaveBeenCalledTimes(2);

    fireEvent.press(reasonDescriptionC!);
    expect(onReasonSelection).toHaveBeenCalledTimes(3);
  });
});
