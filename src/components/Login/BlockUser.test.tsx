import { render, cleanup, fireEvent, act } from "@testing-library/react-native";
import React from "react";
import * as Linking from "expo-linking";
import { InitialisationContainer } from "./BlockUser";
import { mockNavigation } from "../../test/helpers/navigation";
import "../../common/i18n/i18nMock";

const blockUserId = "block-user-view";
const launchWebAppButtonId = "launch-webapp";

const mockRoute: any = {
  params: {},
};

jest.mock("expo-linking", () => ({
  openURL: jest.fn(),
}));

describe("LoginContainer component tests", () => {
  afterEach(() => {
    cleanup();
  });

  it("should render block user page", () => {
    expect.assertions(1);
    const { getByTestId } = render(
      <InitialisationContainer navigation={mockNavigation} route={mockRoute} />
    );
    expect(getByTestId(blockUserId)).not.toBeNull();
  });

  it("should redirect user to webapp", async () => {
    expect.assertions(1);

    const { getByTestId } = render(
      <InitialisationContainer navigation={mockNavigation} route={mockRoute} />
    );

    const launchWebAppButton = getByTestId(launchWebAppButtonId);

    await act(async () => {
      fireEvent.press(launchWebAppButton);
    });

    expect(Linking.openURL).toHaveBeenCalledWith("https://app.supply.gov.sg");
  });
});
