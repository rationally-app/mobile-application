import React, { FunctionComponent } from "react";
import { size, fontSize } from "../../common/styles";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AppText } from "../Layout/AppText";
import { format, isSameDay } from "date-fns";

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
    color: "white",
  },
  statText: {
    fontFamily: "brand-bold",
    textAlign: "center",
    flexDirection: "column",
    width: "100%",
    color: "white",
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
  return (
    <View style={styles.appHeaderWrapper}>
      <AppText style={styles.smallText}>You distributed</AppText>
      <AppText style={styles.statText}>{totalCount?.toLocaleString()}</AppText>
      <AppText style={styles.smallText}>
        Last distributed at{" "}
        {lastTransactionTime !== null
          ? format(lastTransactionTime, "h:mma")
          : "-"}
      </AppText>
      <View style={styles.dateToggle}>
        <TouchableOpacity onPress={onPressPrevDay}>
          <View>
            <MaterialCommunityIcons
              name="chevron-left"
              size={size(4)}
              color="white"
              style={styles.chevron}
              accessibilityLabel="title-statistics-chevron-left"
              testID="title-statistics-chevron-left"
              accessible={true}
            />
          </View>
        </TouchableOpacity>
        <AppText style={styles.dateText}>
          {format(new Date(currentTimestamp), "dd MMM yyyy")}
        </AppText>
        <TouchableOpacity onPress={onPressNextDay}>
          <View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={size(4)}
              color={
                isSameDay(currentTimestamp, Date.now()) ? "#597585" : "white"
              }
              style={styles.chevron}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const TitleStatistic = TitleStatisticComponent;
