import { render, fireEvent } from "@testing-library/react-native";
import React from "react";
import { ErrorBoundaryContent } from "./ErrorBoundaryContent";
import "../../common/i18n/i18nMock";
import { en } from "../../common/i18n/translations/en";
import * as Updates from "expo-updates";
import { BackHandler } from "react-native";
import { cleanup } from "@testing-library/react-hooks";

jest.mock("expo-updates");
const reloadAsyncMock = Updates.reloadAsync as jest.Mock;

describe("ErrorBoundaryContent", () => {
  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
  });

  it("should render system error when errorName is not defined", () => {
    expect.assertions(5);
    const { title, body, primaryActionText, secondaryActionText } =
      en.errorMessages.systemError;

    const { queryByText } = render(<ErrorBoundaryContent />);

    const primaryActionButton = queryByText(primaryActionText);
    const secondaryActionButton = queryByText(secondaryActionText!);

    expect(queryByText(title)).not.toBeNull();
    expect(queryByText(body!)).not.toBeNull();
    expect(primaryActionButton).not.toBeNull();
    expect(secondaryActionButton).not.toBeNull();

    fireEvent.press(primaryActionButton!);
    expect(reloadAsyncMock).toHaveBeenCalledTimes(1);
  });

  it("should render network error when errorName is NetworkError", () => {
    expect.assertions(5);
    const { title, body, primaryActionText, secondaryActionText } =
      en.errorMessages.networkError;

    const { queryByText } = render(
      <ErrorBoundaryContent errorName="NetworkError" />
    );

    const primaryActionButton = queryByText(primaryActionText);
    const secondaryActionButton = queryByText(secondaryActionText!);

    expect(queryByText(title)).not.toBeNull();
    expect(queryByText(body!)).not.toBeNull();
    expect(primaryActionButton).not.toBeNull();
    expect(secondaryActionButton).not.toBeNull();

    fireEvent.press(primaryActionButton!);
    expect(reloadAsyncMock).toHaveBeenCalledTimes(1);
  });

  it("should render rooted device error when errorName is RootedDeviceDetectedError", () => {
    expect.assertions(4);

    const exitAppMock = jest.fn();
    jest.spyOn(BackHandler, "exitApp").mockImplementation(exitAppMock);
    const { title, body, primaryActionText } =
      en.errorMessages.rootedDeviceDetected;

    const { queryByText } = render(
      <ErrorBoundaryContent errorName="RootedDeviceDetectedError" />
    );

    const primaryActionButton = queryByText(primaryActionText);
    expect(queryByText(title)).not.toBeNull();
    expect(queryByText(body!)).not.toBeNull();
    expect(primaryActionButton).not.toBeNull();

    fireEvent.press(primaryActionButton!);
    expect(exitAppMock).toHaveBeenCalledTimes(1);
  });
});
