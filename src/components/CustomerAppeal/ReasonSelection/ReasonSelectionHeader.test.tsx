import { render, cleanup } from "@testing-library/react-native";
import React from "react";
import { Sentry } from "../../../utils/errorTracking";
import { ReasonSelectionHeader } from "./ReasonSelectionHeader";
import "../../../common/i18n/i18nMock";

jest.mock("../../../utils/errorTracking");
const mockCaptureException = jest.fn();
(Sentry.captureException as jest.Mock).mockImplementation(mockCaptureException);

describe("ReasonSelectionHeader", () => {
  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
  });

  it("should render the header correctly", async () => {
    expect.assertions(1);
    const { queryByText } = render(
      <ReasonSelectionHeader title="Reason Header" />
    );

    expect(queryByText("Reason Header")).not.toBeNull();
  });
});
