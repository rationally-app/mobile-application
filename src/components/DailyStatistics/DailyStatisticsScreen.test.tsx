/* eslint-disable react/display-name */
import { render, cleanup, fireEvent } from "@testing-library/react-native";
import React from "react";
import { Sentry } from "../../utils/errorTracking";
import { DailyStatisticsScreenContainer } from "./DailyStatisticsScreen";
import "../../common/i18n/i18nMock";

jest.mock("../../utils/errorTracking");
const mockCaptureException = jest.fn();
(Sentry.captureException as jest.Mock).mockImplementation(mockCaptureException);

const mockDate = jest.spyOn(global.Date, "now");
const mockNavigate: any = { navigate: jest.fn() };
const mockRoute: any = {
  params: {},
};

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

jest.mock("../../hooks/useDailyStatistics/useDailyStatistics", () => ({
  useDailyStatistics: () => ({
    lastTransactionTime: new Date(0),
    totalCount: 999,
    transactionHistory: mockTransactionHistory,
    error: undefined,
    loading: false,
  }),
}));

describe("DailyStatisticsScreen", () => {
  beforeEach(() => {
    mockDate.mockReturnValue(86400000); // in milliseconds
  });

  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
  });

  it("should render correctly", async () => {
    expect.assertions(6);

    const { queryByText } = render(
      <DailyStatisticsScreenContainer
        navigation={mockNavigate}
        route={mockRoute}
      />
    );

    expect(queryByText("999")).not.toBeNull();
    expect(queryByText("02 Jan 1970")).not.toBeNull();
    expect(queryByText("Last distributed at 7:30AM")).not.toBeNull();

    expect(queryByText("item-a")).not.toBeNull();
    expect(queryByText("alert")).not.toBeNull();

    expect(queryByText("item-b")).not.toBeNull();
  });

  it("should be able to change date", async () => {
    expect.assertions(4);

    const { queryByText, queryByTestId } = render(
      <DailyStatisticsScreenContainer
        navigation={mockNavigate}
        route={mockRoute}
      />
    );

    const chevronLeft = queryByTestId("title-statistics-chevron-left");
    const chevronRight = queryByTestId("title-statistics-chevron-right");
    expect(chevronLeft).not.toBeNull();
    expect(chevronRight).not.toBeNull();

    fireEvent.press(chevronLeft!);
    expect(queryByText("01 Jan 1970")).not.toBeNull();

    fireEvent.press(chevronRight!);
    expect(queryByText("02 Jan 1970")).not.toBeNull();
  });
});
