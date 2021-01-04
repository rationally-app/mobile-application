import React, { FunctionComponent } from "react";
import { View, StyleSheet } from "react-native";
import { AppText } from "../Layout/AppText";
import { fontSize, size, color } from "../../common/styles";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";

export const styles = StyleSheet.create({
  wrapper: {
    marginTop: size(2),
    marginBottom: size(2),
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  itemHeader: {
    fontFamily: "brand-bold",
    lineHeight: 1.5 * fontSize(0),
  },
  itemSubheader: {
    fontSize: fontSize(-1),
    fontFamily: "brand-bold",
  },
  itemDetailWrapper: {
    flexDirection: "row",
  },
  itemDetailBorder: {
    borderLeftWidth: 1,
    borderLeftColor: color("grey", 30),
    marginLeft: size(1),
    marginRight: size(1),
  },
  itemDetail: {
    fontSize: fontSize(-1),
  },
  appealLabel: {
    fontSize: fontSize(-1),
    color: color("red", 60),
    fontFamily: "brand-italic",
  },
});

export interface Transaction {
  header: string;
  details: string;
  quantity: string;
  isAppeal: boolean;
  order: number;
}

export interface TransactionsGroup {
  header: string;
  transactions: Transaction[];
  order: number;
}

const Transaction: FunctionComponent<Transaction> = ({
  header: transactionDate,
  details,
  quantity,
  isAppeal,
}) => {
  const { i18nt } = useTranslate();
  return (
    <>
      <View style={styles.itemRow}>
        <AppText style={styles.itemSubheader}>{transactionDate}</AppText>
        <AppText style={styles.itemSubheader}>{quantity}</AppText>
      </View>
      {!!details && (
        <View style={styles.itemRow}>
          <View style={styles.itemDetailWrapper}>
            <View style={styles.itemDetailBorder} />
            <AppText style={styles.itemDetail}>{details}</AppText>
          </View>
          {isAppeal && (
            <AppText style={{ ...styles.appealLabel, alignSelf: "flex-start" }}>
              {i18nt("statisticsScreen", "viaAppeal")}
            </AppText>
          )}
        </View>
      )}
      {!details && isAppeal && (
        <AppText style={{ ...styles.appealLabel, textAlign: "right" }}>
          {i18nt("statisticsScreen", "viaAppeal")}
        </AppText>
      )}
    </>
  );
};

export const TransactionsGroup: FunctionComponent<
  TransactionsGroup & {
    maxTransactionsToDisplay: number;
  }
> = ({ header, transactions, maxTransactionsToDisplay }) => {
  const shouldShowGroup = transactions[0].order < maxTransactionsToDisplay;
  return shouldShowGroup ? (
    <View style={styles.wrapper}>
      <View style={styles.itemRow}>
        <AppText style={styles.itemHeader}>{header}</AppText>
      </View>
      {transactions.map(
        (transaction, index) =>
          transaction.order < maxTransactionsToDisplay && (
            <Transaction key={index} {...transaction} />
          )
      )}
    </View>
  ) : null;
};
