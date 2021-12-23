import React, { FunctionComponent } from "react";
import { size, fontSize } from "../../common/styles";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AppText } from "../Layout/AppText";
import { format, isSameDay } from "date-fns";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { useTheme } from "../../context/theme";

const distributedAmount = "distributedAmount";
const lastDistributedTiming = "lastDistributedTiming";

interface TitleStatisticComponent {
  totalCount: number | null;
  currentTimestamp: number;
  lastTransactionTime: Date | null;
  onPressPrevDay: () => void;
  onPressNextDay: () => void;
}

const styles = StyleSheet.create({
  appHeaderWrapper: {
    flexDirection: "column",
    justifyContent: "space-between",
    paddingTop: size(4),
    width: "100%",
    alignItems: "center",
  },
  smallText: {
    textAlign: "center",
    width: "100%",
  },
  statText: {
    fontFamily: "brand-bold",
    textAlign: "center",
    flexDirection: "column",
    width: "100%",
    fontSize: fontSize(7),
  },
  dateText: {
    marginTop: size(1),
    fontSize: size(2),
    fontFamily: "brand-bold",
    textAlign: "center",
    color: "white",
  },
  dateToggle: {
    marginTop: size(1),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chevron: {
    marginTop: size(1),
    marginRight: size(7),
    marginLeft: size(7),
  },
});

export const TitleStatisticComponent: FunctionComponent<TitleStatisticComponent> = ({
  totalCount,
  currentTimestamp,
  lastTransactionTime,
  onPressPrevDay,
  onPressNextDay,
}) => {
  const { theme } = useTheme();
  const { i18nt, c13nt } = useTranslate();
  const formattedLastTransactionTime =
    lastTransactionTime !== null ? format(lastTransactionTime, "h:mma") : "-";

  return (
    <View style={styles.appHeaderWrapper}>
      <AppText
        style={{
          ...styles.smallText,
          color: theme.statisticsScreen.smallTextColor,
        }}
      >
        {c13nt(distributedAmount) !== distributedAmount
          ? c13nt(distributedAmount)
          : i18nt("statisticsScreen", distributedAmount)}
      </AppText>
      <AppText
        style={{
          ...styles.statText,
          color: theme.statisticsScreen.statTextColor,
        }}
      >
        {totalCount?.toLocaleString()}
      </AppText>
      <AppText
        style={{
          ...styles.smallText,
          color: theme.statisticsScreen.smallTextColor,
        }}
      >
        {c13nt(lastDistributedTiming) !== lastDistributedTiming
          ? c13nt(lastDistributedTiming).replace(
              "%{dateTime}",
              formattedLastTransactionTime
            )
          : i18nt("statisticsScreen", lastDistributedTiming, undefined, {
              dateTime: formattedLastTransactionTime,
            })}
      </AppText>
      <View style={styles.dateToggle}>
        <TouchableOpacity onPress={onPressPrevDay}>
          <View>
            <MaterialCommunityIcons
              name="chevron-left"
              size={size(4)}
              color={theme.statisticsScreen.enabledChevron}
              style={styles.chevron}
              accessibilityLabel="title-statistics-chevron-left"
              testID="title-statistics-chevron-left"
              accessible={true}
            />
          </View>
        </TouchableOpacity>
        <AppText
          style={{
            ...styles.dateText,
            color: theme.statisticsScreen.dateTextColor,
          }}
        >
          {format(new Date(currentTimestamp), "dd MMM yyyy")}
        </AppText>
        <TouchableOpacity onPress={onPressNextDay}>
          <View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={size(4)}
              color={
                isSameDay(currentTimestamp, Date.now())
                  ? theme.statisticsScreen.disabledChevron
                  : theme.statisticsScreen.enabledChevron
              }
              style={{
                ...styles.chevron,
                opacity: isSameDay(currentTimestamp, Date.now())
                  ? theme.statisticsScreen.disabledChevronOpacity
                  : theme.statisticsScreen.enabledChevronOpacity,
              }}
              accessibilityLabel="title-statistics-chevron-right"
              testID="title-statistics-chevron-right"
              accessible={true}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const TitleStatistic = TitleStatisticComponent;
