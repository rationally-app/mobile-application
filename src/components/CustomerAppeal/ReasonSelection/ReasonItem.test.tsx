import { render, cleanup, fireEvent } from "@testing-library/react-native";
import React from "react";
import { ReasonItem } from "./ReasonItem";
import "../../../common/i18n/i18nMock";

const onReasonSelection = jest.fn();

describe("ReasonItem", () => {
  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
  });

  it("should render the item correctly", async () => {
    expect.assertions(4);

    const { queryByText } = render(
      <ReasonItem
        category={"category-a"}
        description={"some-description"}
        descriptionAlert={"*alert"}
        isLast={true}
        onReasonSelection={onReasonSelection}
      />
    );

    const reasonDescription = queryByText("some-description");
    const reasonDescriptionAlert = queryByText("*alert");
    expect(reasonDescription).not.toBeNull();
    expect(reasonDescriptionAlert).not.toBeNull();

    fireEvent.press(reasonDescription!);
    expect(onReasonSelection).toHaveBeenCalledTimes(1);
    expect(onReasonSelection).toHaveBeenCalledWith("category-a");
  });
});
