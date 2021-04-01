import { render, fireEvent, cleanup } from "@testing-library/react-native";
import React from "react";
import { Sentry } from "../../../utils/errorTracking";
import { ReasonSelectionCard } from "./ReasonSelectionCard";
import "../../../common/i18n/i18nMock";

jest.mock("../../../utils/errorTracking");
const mockCaptureException = jest.fn();
(Sentry.captureException as jest.Mock).mockImplementation(mockCaptureException);

const onCancel = jest.fn();
const onReasonSelection = jest.fn();
const getReasons = jest
  .fn()
  .mockReturnValue([
    { description: "reason-a" },
    { description: "reason-b" },
    { description: "reason-c" },
  ]);

describe("ReasonSelectionCard", () => {
  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
  });

  it("should render the reasons correctly", async () => {
    expect.assertions(6);
    const { queryByText } = render(
      <ReasonSelectionCard
        ids={["S0000001I"]}
        reasonSelectionHeader={"Indicate reason for appeal"}
        reasons={getReasons()}
        onCancel={onCancel}
        onReasonSelection={onReasonSelection}
      />
    );

    const reasonA = queryByText("reason-a");
    const reasonB = queryByText("reason-b");
    const reasonC = queryByText("reason-c");

    expect(reasonA!).not.toBeNull();
    expect(reasonB!).not.toBeNull();
    expect(reasonC!).not.toBeNull();

    fireEvent.press(reasonA!);
    expect(onReasonSelection).toHaveBeenCalledTimes(1);

    fireEvent.press(reasonB!);
    expect(onReasonSelection).toHaveBeenCalledTimes(2);

    fireEvent.press(reasonC!);
    expect(onReasonSelection).toHaveBeenCalledTimes(3);
  });
});
