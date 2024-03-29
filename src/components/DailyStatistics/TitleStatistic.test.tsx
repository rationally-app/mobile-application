import { render, cleanup } from "@testing-library/react-native";
import React, { FunctionComponent, ReactNode } from "react";
import { TitleStatistic } from "./TitleStatistic";
import "../../common/i18n/i18nMock";
import { ThemeContext } from "../../../src/context/theme";
import { govWalletTheme } from "../../../src/common/styles/themes";
import { CampaignConfigContext } from "../../../src/context/campaignConfig";

const onPressPrevDay = jest.fn();
const onPressNextDay = jest.fn();

const GovWalletCampaignWrapper: FunctionComponent<{
  children?: ReactNode | undefined;
}> = ({ children }): JSX.Element => {
  return (
    <ThemeContext.Provider
      value={{ theme: govWalletTheme, setTheme: () => {} }}
    >
      <CampaignConfigContext.Provider
        value={{
          policies: null,
          features: null,
          c13n: {
            distributedAmount: "You have recorded",
            lastDistributedTiming: "Last recorded at %{dateTime}",
          },
        }}
      >
        {children}
      </CampaignConfigContext.Provider>
    </ThemeContext.Provider>
  );
};

describe("TitleStatistic", () => {
  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
  });

  it("should render correctly", async () => {
    expect.assertions(3);
    const { queryByText } = render(
      <TitleStatistic
        totalCount={999}
        currentTimestamp={0}
        lastTransactionTime={new Date(0)}
        onPressPrevDay={onPressPrevDay}
        onPressNextDay={onPressNextDay}
      />
    );

    expect(queryByText("999")).not.toBeNull();
    expect(queryByText("01 Jan 1970")).not.toBeNull();
    expect(queryByText("Last distributed at 7:30AM")).not.toBeNull();
  });

  it("should render null count correctly", async () => {
    expect.assertions(3);
    const { queryByText, queryByDisplayValue } = render(
      <TitleStatistic
        totalCount={null}
        currentTimestamp={0}
        lastTransactionTime={null}
        onPressPrevDay={onPressPrevDay}
        onPressNextDay={onPressNextDay}
      />
    );

    expect(queryByDisplayValue("")).toBeNull();
    expect(queryByText("01 Jan 1970")).not.toBeNull();
    expect(queryByText("Last distributed at -")).not.toBeNull();
  });

  it("should render correctly for GovWallet", async () => {
    expect.assertions(4);
    const { queryByText } = render(
      <GovWalletCampaignWrapper>
        <TitleStatistic
          totalCount={999}
          currentTimestamp={0}
          lastTransactionTime={new Date(0)}
          onPressPrevDay={onPressPrevDay}
          onPressNextDay={onPressNextDay}
        />
      </GovWalletCampaignWrapper>
    );

    expect(queryByText("You have recorded")).not.toBeNull();
    expect(queryByText("999")).not.toBeNull();
    expect(queryByText("01 Jan 1970")).not.toBeNull();
    expect(queryByText("Last recorded at 7:30AM")).not.toBeNull();
  });

  it("should render null correctly for GovWallet", async () => {
    expect.assertions(4);
    const { queryByText, queryByDisplayValue } = render(
      <GovWalletCampaignWrapper>
        <TitleStatistic
          totalCount={null}
          currentTimestamp={0}
          lastTransactionTime={null}
          onPressPrevDay={onPressPrevDay}
          onPressNextDay={onPressNextDay}
        />
      </GovWalletCampaignWrapper>
    );

    expect(queryByText("You have recorded")).not.toBeNull();
    expect(queryByDisplayValue("")).toBeNull();
    expect(queryByText("01 Jan 1970")).not.toBeNull();
    expect(queryByText("Last recorded at -")).not.toBeNull();
  });
});
