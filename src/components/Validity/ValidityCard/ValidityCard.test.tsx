import React from "react";
import { render, wait } from "@testing-library/react-native";
import { CheckStatus, CHECK_MESSAGES } from "../constants";
import { ValidityCard } from "./ValidityCard";

describe("ValidityCard", () => {
  describe("when some checks are still in progress and no invalid checks", () => {
    it("should show the checking label", async () => {
      expect.assertions(6);
      const { queryByTestId, queryAllByTestId } = render(
        <ValidityCard
          tamperedCheck={CheckStatus.CHECKING}
          issuedCheck={CheckStatus.CHECKING}
          revokedCheck={CheckStatus.CHECKING}
          issuerCheck={CheckStatus.VALID}
          overallValidity={CheckStatus.CHECKING}
        />
      );
      await wait(() => {
        expect(queryByTestId("validity-header-label")).toHaveTextContent(
          "Verifying..."
        );
        const messages = queryAllByTestId("validity-check-message");
        expect(messages).toHaveLength(4);
        expect(messages[0]).toHaveTextContent(
          CHECK_MESSAGES.TAMPERED_CHECK[CheckStatus.CHECKING].message
        );
        expect(messages[1]).toHaveTextContent(
          CHECK_MESSAGES.ISSUED_CHECK[CheckStatus.CHECKING].message
        );
        expect(messages[2]).toHaveTextContent(
          CHECK_MESSAGES.REVOKED_CHECK[CheckStatus.CHECKING].message
        );
        expect(messages[3]).toHaveTextContent(
          CHECK_MESSAGES.ISSUER_CHECK[CheckStatus.VALID].message
        );
      });
    });
  });

  describe("when everything is valid", () => {
    it("should show the valid label", async () => {
      expect.assertions(6);
      const { queryByTestId, queryAllByTestId } = render(
        <ValidityCard
          tamperedCheck={CheckStatus.VALID}
          issuedCheck={CheckStatus.VALID}
          revokedCheck={CheckStatus.VALID}
          issuerCheck={CheckStatus.VALID}
          overallValidity={CheckStatus.VALID}
        />
      );
      await wait(() => {
        expect(queryByTestId("validity-header-label")).toHaveTextContent(
          "Valid"
        );
        const messages = queryAllByTestId("validity-check-message");
        expect(messages).toHaveLength(4);
        expect(messages[0]).toHaveTextContent(
          CHECK_MESSAGES.TAMPERED_CHECK[CheckStatus.VALID].message
        );
        expect(messages[1]).toHaveTextContent(
          CHECK_MESSAGES.ISSUED_CHECK[CheckStatus.VALID].message
        );
        expect(messages[2]).toHaveTextContent(
          CHECK_MESSAGES.REVOKED_CHECK[CheckStatus.VALID].message
        );
        expect(messages[3]).toHaveTextContent(
          CHECK_MESSAGES.ISSUER_CHECK[CheckStatus.VALID].message
        );
      });
    });
  });

  describe("when some checks are invalid", () => {
    it("should show the invalid label", async () => {
      expect.assertions(6);
      const { queryByTestId, queryAllByTestId } = render(
        <ValidityCard
          tamperedCheck={CheckStatus.VALID}
          issuedCheck={CheckStatus.INVALID}
          revokedCheck={CheckStatus.INVALID}
          issuerCheck={CheckStatus.VALID}
          overallValidity={CheckStatus.INVALID}
        />
      );
      await wait(() => {
        expect(queryByTestId("validity-header-label")).toHaveTextContent(
          "Invalid"
        );
        const messages = queryAllByTestId("validity-check-message");
        expect(messages).toHaveLength(4);
        expect(messages[0]).toHaveTextContent(
          CHECK_MESSAGES.TAMPERED_CHECK[CheckStatus.VALID].message
        );
        expect(messages[1]).toHaveTextContent(
          CHECK_MESSAGES.ISSUED_CHECK[CheckStatus.INVALID].message
        );
        expect(messages[2]).toHaveTextContent(
          CHECK_MESSAGES.REVOKED_CHECK[CheckStatus.INVALID].message
        );
        expect(messages[3]).toHaveTextContent(
          CHECK_MESSAGES.ISSUER_CHECK[CheckStatus.VALID].message
        );
      });
    });
  });
});
