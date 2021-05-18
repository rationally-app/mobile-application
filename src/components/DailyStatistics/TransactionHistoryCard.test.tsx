import { render, cleanup } from "@testing-library/react-native";
import React from "react";
import { TransactionHistoryCard } from "./TransactionHistoryCard";
import "../../common/i18n/i18nMock";

describe("TransactionHistoryCard", () => {
  const mockTransactionHistory = [
    {
      name: "item-a",
      category: "category-a",
      quantityText: "pcs",
      descriptionAlert: "alert",
    },
    {
      name: "item-b",
      category: "category-b",
      quantityText: "ea",
    },
  ];

  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
  });

  it("should render the statistics correctly", async () => {
    expect.assertions(5);
    const { queryByText } = render(
      <TransactionHistoryCard
        transactionHistory={mockTransactionHistory}
        loading={false}
      />
    );

    expect(queryByText("item-a")).not.toBeNull();
    expect(queryByText("pcs")).not.toBeNull();
    expect(queryByText("alert")).not.toBeNull();

    expect(queryByText("item-b")).not.toBeNull();
    expect(queryByText("ea")).not.toBeNull();
  });

  it("should not render when it's loading", async () => {
    expect.assertions(5);
    const { queryByText } = render(
      <TransactionHistoryCard
        transactionHistory={mockTransactionHistory}
        loading={true}
      />
    );

    expect(queryByText("item-a")).toBeNull();
    expect(queryByText("pcs")).toBeNull();
    expect(queryByText("alert")).toBeNull();

    expect(queryByText("item-b")).toBeNull();
    expect(queryByText("ea")).toBeNull();
  });
});
