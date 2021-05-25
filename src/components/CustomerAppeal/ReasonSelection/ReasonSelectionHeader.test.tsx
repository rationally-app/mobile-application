import { render, cleanup } from "@testing-library/react-native";
import React from "react";
import { ReasonSelectionHeader } from "./ReasonSelectionHeader";
import "../../../common/i18n/i18nMock";

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

  it("should render the null header", async () => {
    expect.assertions(1);
    const { queryByDisplayValue } = render(<ReasonSelectionHeader title="" />);

    expect(queryByDisplayValue("")).toBeNull();
  });
});
