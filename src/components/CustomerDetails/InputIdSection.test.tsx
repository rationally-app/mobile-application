import { render, cleanup, fireEvent } from "@testing-library/react-native";
import React from "react";
import { InputIdSection } from "./InputIdSection";
import "../../common/i18n/i18nMock";

const openCamera = jest.fn();
const setIdInput = jest.fn();
const submitId = jest.fn();

describe("InputIdSection", () => {
  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
  });

  it("should trigger openCamera when pressing scanIdentification", async () => {
    expect.assertions(2);
    const { queryByText } = render(
      <InputIdSection
        openCamera={openCamera}
        idInput={""}
        setIdInput={setIdInput}
        submitId={submitId}
        keyboardType={"default"}
      />
    );

    const scanIdentificationButton = queryByText("Scan identification");
    expect(scanIdentificationButton).not.toBeNull();

    fireEvent.press(scanIdentificationButton!);
    expect(openCamera).toHaveBeenCalledTimes(1);
  });

  it("should trigger setIdInput when the input label changes", async () => {
    expect.assertions(2);
    const { queryByTestId } = render(
      <InputIdSection
        openCamera={openCamera}
        idInput={""}
        setIdInput={setIdInput}
        submitId={submitId}
        keyboardType={"default"}
      />
    );

    const identityDetailsInput = queryByTestId("identity-details-input");
    expect(identityDetailsInput).not.toBeNull();

    fireEvent(identityDetailsInput!, "onChange", {
      nativeEvent: { text: "valid-id" },
    });
    expect(setIdInput).toHaveBeenCalledWith("valid-id");
  });

  it("should trigger submitId when the check button is pressed", async () => {
    expect.assertions(2);
    const { queryByText } = render(
      <InputIdSection
        openCamera={openCamera}
        idInput={""}
        setIdInput={setIdInput}
        submitId={submitId}
        keyboardType={"default"}
      />
    );

    const checkButton = queryByText("Check");
    expect(checkButton).not.toBeNull();

    fireEvent.press(checkButton!);
    expect(submitId).toHaveBeenCalledTimes(1);
  });
});
