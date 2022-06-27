import React, { ReactElement, useState } from "react";
import { storiesOf } from "@storybook/react-native";
import { View } from "react-native";
import { StatisticsHeader } from "../../../src/components/DailyStatistics/StatisticsHeader";
import { TitleStatistic } from "../../../src/components/DailyStatistics/TitleStatistic";
import { TransactionHistoryCard } from "../../../src/components/DailyStatistics/TransactionHistoryCard";
import { size, color } from "../../../src/common/styles";
import { createAppContainer } from "react-navigation";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { addDays, subDays, getTime, isSameDay } from "date-fns";

const reactNavigationDecorator = (story: any): JSX.Element => {
  const Screen = (): any => story();
  const Navigator = createAppContainer(
    createDrawerNavigator(
      { Screen },
      {
        drawerPosition: "right",
        drawerType: "slide",
      }
    )
  );
  return <Navigator />;
};

const TitleStatisticComponent = (): ReactElement => {
  const [currentTimestamp, setCurrentTimestamp] = useState(Date.now());
  const onPressPrevDay = (): void => {
    const prevDay = getTime(subDays(currentTimestamp, 1));
    setCurrentTimestamp(prevDay);
  };

  const onPressNextDay = (): void => {
    if (!isSameDay(currentTimestamp, Date.now())) {
      const nextDay = getTime(addDays(currentTimestamp, 1));
      setCurrentTimestamp(nextDay);
    }
  };
  return (
    <TitleStatistic
      totalCount={10}
      lastTransactionTime={new Date()}
      currentTimestamp={currentTimestamp}
      onPressPrevDay={onPressPrevDay}
      onPressNextDay={onPressNextDay}
    />
  );
};

storiesOf("Statistics", module)
  .addDecorator(reactNavigationDecorator) // decorator is used to wrapper of the story
  .add("Header", () => (
    <View style={{ margin: size(3), backgroundColor: color("blue", 30) }}>
      <StatisticsHeader key="0" />
    </View>
  ))
  .add("TitleStatistic", () => (
    <View
      key="1"
      style={{ margin: size(3), backgroundColor: color("blue", 30) }}
    >
      <TitleStatisticComponent key="1" />
    </View>
  ))
  .add("TransactionHistoryCard", () => (
    <View key="2" style={{ margin: size(3) }}>
      <TransactionHistoryCard
        transactionHistory={[
          {
            name: "Item 1",
            category: "category-a",
            quantityText: "1 qty",
          },
          {
            name: "Item 2",
            category: "category-b",
            quantityText: "2 qty",
            descriptionAlert: "descriptionAlert",
          },
        ]}
        loading={false}
      />
      <View key="3" style={{ marginTop: size(3) }}>
        <TransactionHistoryCard transactionHistory={[]} loading={false} />
      </View>
      <View key="4" style={{ marginTop: size(3) }}>
        <TransactionHistoryCard transactionHistory={[]} loading={true} />
      </View>
    </View>
  ));
