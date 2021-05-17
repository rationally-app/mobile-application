import { render, cleanup, fireEvent } from "@testing-library/react-native";
import React from "react";
import { ManualPassportInput } from "./ManualPassportInput";
import "../../common/i18n/i18nMock";

const setIdInput = jest.fn();
const submitId = jest.fn();

describe("ManualPassportInput", () => {
  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
  });

  it("should be able to input data and submit", async () => {
    expect.assertions(7);
    const { queryByText, queryAllByPlaceholderText, queryByTestId } = render(
      <ManualPassportInput setIdInput={setIdInput} submitId={submitId} />
    );

    const passportNumberInput = queryByTestId("input-with-label-input");
    const passportCountryInput = queryAllByPlaceholderText("Search country");
    const selectedCountry = queryByText("Afghanistan");
    const identityDetailsCheckButton = queryByTestId(
      "identity-details-check-button-passport"
    );

    expect(passportNumberInput).not.toBeNull();
    expect(passportCountryInput).toHaveLength(2);
    expect(selectedCountry).not.toBeNull();
    expect(identityDetailsCheckButton).not.toBeNull();

    fireEvent.press(selectedCountry!);
    expect(passportCountryInput[1]!.props["children"]).toEqual("Afghanistan");

    fireEvent(passportNumberInput!, "onChange", {
      nativeEvent: { text: "valid-alternate-id" },
    });
    expect(passportNumberInput!.props["value"]).toEqual("valid-alternate-id");

    fireEvent.press(identityDetailsCheckButton!);
    expect(submitId).toHaveBeenCalledTimes(1);
  });
});
