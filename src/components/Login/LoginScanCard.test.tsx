import { render, fireEvent, cleanup } from "@testing-library/react-native";
import React from "react";
import { LoginScanCard } from "./LoginScanCard";
import "../../common/i18n/i18nMock";

const onToggleScanner = jest.fn();
const isLoading = false;

describe("LoginScanCard", () => {
  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
  });

  it("should be able to render without error", async () => {
    expect.assertions(1);

    const { getByTestId } = render(
      <LoginScanCard onToggleScanner={onToggleScanner} isLoading={isLoading} />
    );

    const scanButton = getByTestId("base-button");

    fireEvent.press(scanButton);
    expect(onToggleScanner).toHaveBeenCalledTimes(1);
  });
});
