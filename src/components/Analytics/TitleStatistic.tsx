import React, { FunctionComponent } from "react";
import { size, fontSize } from "../../common/styles";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AppText } from "../Layout/AppText";
import { format } from "date-fns";

interface TitleStatisticComponent {
  totalCount: number | null;
  currentTimestamp: number;
  lastTransactionTime: number;
}

const styles = StyleSheet.create({
  appHeaderWrapper: {
    flexDirection: "column",
    justifyContent: "space-between",
    paddingTop: size(4),
    width: "100%",
    alignItems: "center"
  },
  smallText: {
    textAlign: "center",
    width: "100%",
    color: "white"
  },
  statText: {
    fontFamily: "brand-bold",
    textAlign: "center",
    flexDirection: "column",
    width: "100%",
    color: "white",
    fontSize: fontSize(7)
  },
  dateText: {
    marginTop: size(3),
    flexDirection: "row",
    fontFamily: "brand-bold",
    textAlign: "center",
    width: "100%",
    color: "white",
    flex: 1
  },
  chevron: {
    marginTop: size(3),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: size(3),
    marginLeft: size(3)
  }
});

export const TitleStatisticComponent: FunctionComponent<TitleStatisticComponent> = ({
  totalCount,
  currentTimestamp,
  lastTransactionTime
}) => {
  return (
    <View style={styles.appHeaderWrapper}>
      <AppText style={styles.smallText}>You distributed</AppText>
      <AppText style={styles.statText}>{totalCount}</AppText>
      <AppText style={styles.smallText}>
        Last distributed at {format(new Date(lastTransactionTime), "h:mma")}
      </AppText>
      <View style={styles.chevron}>
        <TouchableOpacity>
          <View>
            <MaterialCommunityIcons
              name="chevron-left"
              size={size(4)}
              color="white"
              style={styles.chevron}
            />
          </View>
        </TouchableOpacity>
        <AppText style={styles.dateText}>
          {format(new Date(currentTimestamp), "dd MMM yyyy")}
        </AppText>
        <TouchableOpacity>
          <View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={size(4)}
              color="white"
              style={styles.chevron}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const TitleStatistic = TitleStatisticComponent;
