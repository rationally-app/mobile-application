import React, { FunctionComponent } from "react";
import { View, StyleSheet } from "react-native";
import { AppText } from "../Layout/AppText";
import { fontSize, size, color } from "../../common/styles";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { lineHeight } from "../../common/styles/typography";

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
    lineHeight: 1.5 * fontSize(0),
    fontFamily: "brand-bold",
    fontSize: fontSize(1),
  },
  itemSubheader: {
    fontSize: fontSize(0),
    lineHeight: lineHeight(-1),
    fontFamily: "brand-bold",
  },
  transactionDateTime: {
    fontSize: fontSize(1),
    lineHeight: lineHeight(0, true),
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
    marginTop: 10,
  },
  itemDetail: {
    fontSize: fontSize(0),
    lineHeight: lineHeight(0, true),
    marginTop: 10,
  },
  appealLabel: {
    fontSize: fontSize(0),
    lineHeight: lineHeight(-1),
    color: color("red", 60),
    fontFamily: "brand-italic",
    marginTop: 10,
  },
});

export interface Transaction {
  itemTitle: string;
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
  itemTitle,
  header: transactionDate,
  details,
  quantity,
  isAppeal,
}) => {
  const { i18nt } = useTranslate();
  return (
    <>
      <View style={styles.itemRow}>
        <AppText style={styles.transactionDateTime}>{transactionDate}</AppText>
      </View>
      <View style={styles.itemRow}>
        <AppText style={styles.itemSubheader}>{itemTitle}</AppText>
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
> = ({ transactions, maxTransactionsToDisplay }) => {
  console.log(transactions);
  const shouldShowGroup = transactions[0].order < maxTransactionsToDisplay;
  return shouldShowGroup ? (
    <View style={styles.wrapper}>
      {transactions.map(
        (transaction, index) =>
          transaction.order < maxTransactionsToDisplay && (
            <Transaction key={index} {...transaction} />
          )
      )}
    </View>
  ) : null;
};
