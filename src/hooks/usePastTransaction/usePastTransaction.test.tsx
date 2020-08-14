import React from "react";
import { renderHook } from "@testing-library/react-hooks";
import { usePastTransaction } from "./usePastTransaction";
import {
  getPastTransactions,
  PastTransactionError
} from "../../services/quota";
import {
  EnvVersion,
  PastTransactionsResult,
  PolicyIdentifier
} from "../../types";
import { Wrapper } from "../../test/helpers/wrapper";
import { toDate } from "date-fns";

jest.mock("../../services/quota");
const mockGetPastTransactions = getPastTransactions as jest.Mock;

jest.mock("../../services/envVersion");

const id = "ID1";
const key = "KEY";
const endpoint = "https://myendpoint.com";

const defaultIdentifier: PolicyIdentifier = {
  label: "identifier",
  textInput: { visible: true, disabled: false, type: "STRING" },
  scanButton: { visible: true, disabled: false, type: "BARCODE" }
};

const customProducts: EnvVersion = {
  policies: [
    {
      category: "tt-token",
      categoryType: "DEFAULT", // 'DEFAULT' (default) | 'APPEAL'
      name: "TT Token",
      order: 1,
      identifiers: [
        {
          ...defaultIdentifier,
          label: "first"
        }
      ],
      quantity: {
        period: -1,
        periodType: "ROLLING",
        periodExpression: 365,
        limit: 1,
        default: 1
      },
      type: "REDEEM"
    },
    {
      category: "tt-token-lost",
      categoryType: "APPEAL",
      name: "Lost/stolen token",
      order: 1,
      alert: {
        threshold: 2,
        label: "*chargeable"
      },
      quantity: {
        period: -1,
        periodType: "ROLLING", // ROLLING | CRON;
        periodExpression: 365, // TBD
        limit: 9999,
        default: 1
      },
      identifiers: [
        {
          ...defaultIdentifier,
          label: "first"
        }
      ],
      type: "REDEEM"
    }
  ],
  features: {
    REQUIRE_OTP: true,
    TRANSACTION_GROUPING: false,
    FLOW_TYPE: "DEFAULT",
    id: {
      type: "STRING",
      scannerType: "CODE_39",
      validation: "NRIC"
    }
  }
};

const mockPastTransactions: PastTransactionsResult = {
  pastTransactions: [
    {
      category: "tt-token",
      quantity: 1,
      identifierInputs: [
        {
          ...defaultIdentifier,
          label: "first",
          value: "AAA987654321"
        }
      ],
      transactionTime: toDate(1596530356430)
    },
    {
      category: "tt-token-lost",
      quantity: 1,
      identifierInputs: [
        {
          ...defaultIdentifier,
          label: "first",
          value: "AAA987654322"
        }
      ],
      transactionTime: toDate(1596530356431)
    },
    {
      category: "tt-token-lost",
      quantity: 1,
      identifierInputs: [
        {
          ...defaultIdentifier,
          label: "first",
          value: "AAA987654323"
        }
      ],
      transactionTime: toDate(1596530356432)
    }
  ]
};

const mockEmptyPastTransactions: PastTransactionsResult = {
  pastTransactions: []
};

const mockSomeUnknownError: any = () => {
  const errorMessage = "Some random error";
  throw new PastTransactionError(errorMessage);
};

const wrapper = ({ children }: any): JSX.Element => (
  <Wrapper
    products={customProducts.policies}
    allProducts={customProducts.policies}
    features={customProducts.features}
  >
    {children}
  </Wrapper>
);

describe("usePastTransaction", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("fetch past transactions on initialisation", () => {
    it("should populate the past transactions with values", async () => {
      expect.assertions(1);
      mockGetPastTransactions.mockReturnValueOnce(mockPastTransactions);

      const { result, waitForNextUpdate } = renderHook(
        () => usePastTransaction(id, key, endpoint),
        { wrapper }
      );

      await waitForNextUpdate();

      expect(result.current.pastTransactionsResult).toStrictEqual({
        pastTransactions: [
          {
            category: "tt-token",
            quantity: 1,
            identifierInputs: [
              {
                ...defaultIdentifier,
                label: "first",
                value: "AAA987654321"
              }
            ],
            transactionTime: toDate(1596530356430)
          },
          {
            category: "tt-token-lost",
            quantity: 1,
            identifierInputs: [
              {
                ...defaultIdentifier,
                label: "first",
                value: "AAA987654322"
              }
            ],
            transactionTime: toDate(1596530356431)
          },
          {
            category: "tt-token-lost",
            quantity: 1,
            identifierInputs: [
              {
                ...defaultIdentifier,
                label: "first",
                value: "AAA987654323"
              }
            ],
            transactionTime: toDate(1596530356432)
          }
        ]
      });
    });

    it("should populate the past transactions with empty values", async () => {
      expect.assertions(1);
      mockGetPastTransactions.mockReturnValueOnce(mockEmptyPastTransactions);

      const { result, waitForNextUpdate } = renderHook(
        () => usePastTransaction(id, key, endpoint),
        { wrapper }
      );

      await waitForNextUpdate();

      expect(result.current.pastTransactionsResult).toStrictEqual({
        pastTransactions: []
      });
    });

    // it("should catch error when thrown", async () => {
    //   expect.assertions(1);
    //   mockGetPastTransactions.mockImplementation(() => {
    //     mockSomeUnknownError();
    //   });
    //
    //   const { result } = renderHook(
    //     () => usePastTransaction(id, key, endpoint),
    //     { wrapper }
    //   );
    //
    //   expect(result.current.pastTransactionsResult).toStrictEqual({
    //     pastTransactions: []
    //   });
    // });
  });
});
