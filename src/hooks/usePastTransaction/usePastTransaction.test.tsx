import React, { FunctionComponent } from "react";
import { renderHook } from "@testing-library/react-hooks";
import { usePastTransaction } from "./usePastTransaction";
import {
  getPastTransactions,
  PastTransactionError
} from "../../services/quota";
import { PastTransactionsResult, CampaignPolicy } from "../../types";
import { defaultIdentifier } from "../../test/helpers/defaults";
import { ProductContextProvider } from "../../context/products";
import { ERROR_MESSAGE } from "../../context/alert";

jest.mock("../../services/quota", () => {
  const actualModule = jest.requireActual("../../services/quota");
  return {
    ...actualModule,
    // Only mock
    getPastTransactions: jest.fn()
  };
});
const mockGetPastTransactions = getPastTransactions as jest.Mock;

const ids = ["ID1"];
const key = "KEY";
const endpoint = "https://myendpoint.com";

const customProducts: CampaignPolicy[] = [
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
];

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
      transactionTime: new Date(1596530356430)
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
      transactionTime: new Date(1596530356431)
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
      transactionTime: new Date(1596530356432)
    }
  ]
};

const mockEmptyPastTransactions: PastTransactionsResult = {
  pastTransactions: []
};

const wrapper: FunctionComponent = ({ children }) => (
  <ProductContextProvider products={customProducts}>
    {children}
  </ProductContextProvider>
);

describe("usePastTransaction", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("fetch past transactions on initialisation", () => {
    it("should populate the past transactions with values", async () => {
      expect.assertions(4);
      mockGetPastTransactions.mockReturnValue(mockPastTransactions);

      const { result, waitForNextUpdate } = renderHook(
        () => usePastTransaction(ids, key, endpoint),
        { wrapper }
      );

      expect(result.current.loading).toStrictEqual(true);

      await waitForNextUpdate();

      expect(result.current.pastTransactionsResult).toStrictEqual([
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
          transactionTime: new Date(1596530356430)
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
          transactionTime: new Date(1596530356431)
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
          transactionTime: new Date(1596530356432)
        }
      ]);
      expect(result.current.loading).toStrictEqual(false);
      expect(result.current.error).toBeNull();
    });

    it("should populate the past transactions with empty values", async () => {
      expect.assertions(3);
      mockGetPastTransactions.mockReturnValue(mockEmptyPastTransactions);

      const { result, waitForNextUpdate } = renderHook(
        () => usePastTransaction(ids, key, endpoint),
        { wrapper }
      );

      await waitForNextUpdate();

      expect(result.current.pastTransactionsResult).toStrictEqual([]);
      expect(result.current.loading).toStrictEqual(false);
      expect(result.current.error).toBeNull();
    });

    it("should return PAST_TRANSACTION_ERROR when error thrown", async () => {
      expect.assertions(4);
      mockGetPastTransactions.mockRejectedValue(
        new PastTransactionError(ERROR_MESSAGE.PAST_TRANSACTIONS_ERROR)
      );

      const { result, waitForNextUpdate } = renderHook(
        () => usePastTransaction(ids, key, endpoint),
        { wrapper }
      );

      await waitForNextUpdate();

      expect(result.current.pastTransactionsResult).toBeNull();
      expect(result.current.error).toBeInstanceOf(PastTransactionError);
      expect(result.current.error?.message).toStrictEqual(
        ERROR_MESSAGE.PAST_TRANSACTIONS_ERROR
      );
      expect(result.current.loading).toStrictEqual(false);
    });
  });
});
