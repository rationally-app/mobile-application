import { render, cleanup } from "@testing-library/react-native";
import React from "react";
import { GovWalletIncorrectBalanceCard } from "./IncorrectBalanceCard";

describe("GovWalletIncorrectBalanceCard", () => {
  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
  });

  it("should render the statistics correctly", async () => {
    expect.assertions(3);
    const { queryByText, queryByTestId } = render(
      <GovWalletIncorrectBalanceCard
        ids={["S0000001I"]}
        onCancel={() => {}}
        govWalletBalanceInCents={5000}
        lastModifiedDate={"2022-07-25T11:57:50.000+08:00"}
      />
    );

    expect(queryByText("S0000001I")).not.toBeNull();

    const incorrectBalanceTitle = queryByTestId(
      "govwallet-incorrect-balance-title"
    );

    expect(incorrectBalanceTitle).not.toBeNull();

    expect(queryByText("Incorrect balance")).not.toBeNull();
    // expect(queryByText("/Not entitled to redeem item(s)./")).not.toBeNull();

    // expect(
    //   getByText(
    //     "Not entitled to redeem item(s). Current balance is $50.00 as of 25 Jul 2022, 11:57PM."
    //   )
    // ).not.toBeNull();
  });
});
