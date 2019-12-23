import React from "react";
import { render, wait, fireEvent } from "@testing-library/react-native";
import { ValidityBannerHeader } from "./ValidityBannerHeader";
import { CheckStatus } from "../constants";

jest.mock("../ValidityIcon", () => ({
  ValidityIcon: () => null
}));

jest.useFakeTimers();

describe("ValidityBannerHeader", () => {
  describe("when pressed", () => {
    it("should fire onPress prop", () => {
      expect.assertions(1);
      const onPress = jest.fn();
      const { getByTestId } = render(
        <ValidityBannerHeader
          checkStatus={CheckStatus.VALID}
          onPress={onPress}
        />
      );
      fireEvent.press(getByTestId("validity-header-button"));
      expect(onPress).toHaveBeenCalledTimes(1);
    });
  });

  describe("when expanded", () => {
    it("should show up arrow", async () => {
      expect.assertions(1);
      const { queryByTestId } = render(
        <ValidityBannerHeader
          checkStatus={CheckStatus.CHECKING}
          isExpanded={true}
          onPress={jest.fn()}
        />
      );
      await wait(() => {
        expect(queryByTestId("validity-header-icon")).toHaveProp(
          "name",
          "chevron-up"
        );
      });
    });
  });

  describe("when collapsed", () => {
    it("should show down arrow", async () => {
      expect.assertions(1);
      const { queryByTestId } = render(
        <ValidityBannerHeader
          checkStatus={CheckStatus.CHECKING}
          isExpanded={false}
          onPress={jest.fn()}
        />
      );
      await wait(() => {
        expect(queryByTestId("validity-header-icon")).toHaveProp(
          "name",
          "chevron-down"
        );
      });
    });
  });

  describe("when progress is 1", () => {
    it("should wait some time before hiding the progress bar", async () => {
      expect.assertions(2);
      const { queryByTestId } = render(
        <ValidityBannerHeader
          checkStatus={CheckStatus.VALID}
          isExpanded={false}
          onPress={jest.fn()}
          progress={1}
        />
      );
      await wait(() => {
        expect(queryByTestId("validity-header-progress")).toHaveStyle({
          width: "100%",
          height: 1
        });

        jest.runAllTimers();

        expect(queryByTestId("validity-header-progress")).toHaveStyle({
          width: "100%",
          height: 0
        });
      });
    });
  });

  describe("when some checks are still in progress and no invalid checks", () => {
    it("should show the checking label", async () => {
      expect.assertions(1);
      const { queryByTestId } = render(
        <ValidityBannerHeader
          checkStatus={CheckStatus.CHECKING}
          onPress={jest.fn()}
        />
      );
      await wait(() => {
        expect(queryByTestId("validity-header-label")).toHaveTextContent(
          "Verifying..."
        );
      });
    });
  });

  describe("when everything is valid", () => {
    it("should show the valid label", async () => {
      expect.assertions(1);
      const { queryByTestId } = render(
        <ValidityBannerHeader
          checkStatus={CheckStatus.VALID}
          onPress={jest.fn()}
        />
      );
      await wait(() => {
        expect(queryByTestId("validity-header-label")).toHaveTextContent(
          "Valid"
        );
      });
    });
  });

  describe("when some checks are invalid", () => {
    it("should show the invalid label", async () => {
      expect.assertions(1);
      const { queryByTestId } = render(
        <ValidityBannerHeader
          checkStatus={CheckStatus.INVALID}
          onPress={jest.fn()}
        />
      );

      await wait(() => {
        expect(queryByTestId("validity-header-label")).toHaveTextContent(
          "Invalid"
        );
      });
    });
  });
});
