import { render, cleanup, fireEvent } from "@testing-library/react-native";
import React from "react";
import { Sentry } from "../../../utils/errorTracking";
import { ReasonItem } from "./ReasonItem";
import "../../../common/i18n/i18nMock";

jest.mock("../../../utils/errorTracking");
const mockCaptureException = jest.fn();
(Sentry.captureException as jest.Mock).mockImplementation(mockCaptureException);

const onReasonSelection = jest.fn();

describe("ReasonItem", () => {
  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
  });

  it("should render the item correctly", async () => {
    expect.assertions(3);

    const description = "reason-a";
    const { queryByText } = render(
      <ReasonItem
        description={description}
        isLast={true}
        onReasonSelection={onReasonSelection}
      />
    );

    const reasonA = queryByText("reason-a");
    expect(reasonA).not.toBeNull();

    fireEvent.press(reasonA!);
    expect(onReasonSelection).toHaveBeenCalledTimes(1);
    expect(onReasonSelection).toHaveBeenCalledWith(description);
  });
});
