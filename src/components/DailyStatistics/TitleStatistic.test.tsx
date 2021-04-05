import { render, cleanup } from "@testing-library/react-native";
import React from "react";
import { TitleStatistic } from "./TitleStatistic";
import "../../common/i18n/i18nMock";

const onPressPrevDay = jest.fn();
const onPressNextDay = jest.fn();

describe("TitleStatistic", () => {
  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
  });

  it("should render the title correctly", async () => {
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
});
