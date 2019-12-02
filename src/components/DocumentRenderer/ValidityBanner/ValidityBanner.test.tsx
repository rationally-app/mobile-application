import React from "react";
import { render, wait } from "@testing-library/react-native";
import { ValidityBanner } from "./index";
import { CheckStatus } from "../../../constants/verifier";

jest.useFakeTimers();

describe("ValidityBanner", () => {
  describe("when everything is valid", () => {
    it("should provide ValidityBannerHeader the correct progress prop", async () => {
      expect.assertions(1);
      const { getByTestId } = render(
        <ValidityBanner
          tamperedCheck={CheckStatus.VALID}
          issuedCheck={CheckStatus.VALID}
          revokedCheck={CheckStatus.VALID}
          issuerCheck={CheckStatus.VALID}
          overallValidity={CheckStatus.VALID}
          initialIsExpanded={false}
        />
      );
      await wait(() => {
        expect(getByTestId("validity-header-progress")).toHaveStyle({
          width: "100%"
        });
      });
    });
  });

  describe("when some checks are invalid", () => {
    it("should provide ValidityBannerHeader the correct progress prop", async () => {
      expect.assertions(1);
      const { getByTestId } = render(
        <ValidityBanner
          tamperedCheck={CheckStatus.VALID}
          issuedCheck={CheckStatus.VALID}
          revokedCheck={CheckStatus.CHECKING}
          issuerCheck={CheckStatus.INVALID}
          overallValidity={CheckStatus.INVALID}
          initialIsExpanded={false}
        />
      );
      await wait(() =>
        expect(getByTestId("validity-header-progress")).toHaveStyle({
          width: "75%"
        })
      );
    });
  });

  describe("when some checks are still in progress and no invalid checks", () => {
    it("should provide ValidityBannerHeader the correct progress prop", async () => {
      expect.assertions(1);
      const { getByTestId } = render(
        <ValidityBanner
          tamperedCheck={CheckStatus.VALID}
          issuedCheck={CheckStatus.CHECKING}
          revokedCheck={CheckStatus.CHECKING}
          issuerCheck={CheckStatus.VALID}
          overallValidity={CheckStatus.CHECKING}
          initialIsExpanded={false}
        />
      );

      await wait(() =>
        expect(getByTestId("validity-header-progress")).toHaveStyle({
          width: "50%"
        })
      );
    });
  });
});
