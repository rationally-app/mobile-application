import {
  fireEvent,
  render,
  waitForElement,
} from "@testing-library/react-native";
import React from "react";
import { act } from "react-test-renderer";
import { NavigationProps } from "../../types";
import { InitialisationContainer } from "./LoginContainer";

const mockNavigateProp: NavigationProps = {
  navigation: {
    openDrawer: jest.fn(),
    closeDrawer: jest.fn(),
    toggleDrawer: jest.fn(),
    jumpTo: jest.fn(),
    addListener: jest.fn(),
    dangerouslyGetParent: jest.fn(),
    dispatch: jest.fn(),
    emit: jest.fn(),
    getParam: jest.fn(),
    goBack: jest.fn(),
    isFirstRouteInParent: jest.fn(),
    isFocused: jest.fn(),
    navigate: jest.fn(),
    router: undefined,
    setParams: jest.fn(),
    state: {
      key: "LoginScreen",
      params: undefined,
      routeName: "LoginScreen",
      isTransitioning: false,
      index: 0,
      routes: [],
    },
    dismiss: jest.fn(),
  },
};

describe("Test LoginScan Card", () => {
  it("On click scan, camera opens", async () => {
    expect.assertions(2);

    const componentTree = render(
      <InitialisationContainer {...mockNavigateProp} />
    );
    const scanToLoginBtn = componentTree.getByTestId("base-button");
    act(() => {
      fireEvent.press(scanToLoginBtn);
    });
    expect(componentTree.getByTestId("camera-wrapper")).not.toBeNull();
    expect(componentTree.getByTestId("loading-view")).not.toBeNull();
    await waitForElement(() => componentTree.getByTestId("back-button"));
  });
});
