import React, { FunctionComponent } from "react";
import { size, fontSize } from "../../common/styles";
import { StyleSheet, View } from "react-native";
import { AppText } from "../Layout/AppText";
import { ItemQuantity } from "./types";

interface TransactionHistoryComponent {
  transactionHistory: ItemQuantity[];
}

const styles = StyleSheet.create({
  stats: {
    flexDirection: "row"
  },
  categoryName: {
    fontFamily: "brand-bold",
    fontSize: fontSize(1),
    marginBottom: size(3),
    flexDirection: "row",
    marginRight: "50%"
  },
  test: {
    fontFamily: "brand-bold",
    fontSize: fontSize(1),
    marginBottom: size(3),
    flexDirection: "row"
  },
  quantity: {
    flexDirection: "row",
    fontSize: fontSize(1),
    marginRight: "1%"
  },
  noTransactionText: {
    fontFamily: "brand-bold",
    fontSize: fontSize(1),
    marginBottom: size(3),
    flexDirection: "row",
    textAlign: "center"
  }
});

export const TransactionHistoryComponent: FunctionComponent<TransactionHistoryComponent> = ({
  transactionHistory
}) => {
  return (
    <>
      {transactionHistory.length !== 0 ? (
        transactionHistory.map(item => (
          <View style={styles.stats}>
            <AppText style={styles.categoryName}>{item.category}</AppText>
            <AppText style={styles.quantity}>{item.quantity}</AppText>
            <AppText style={styles.test}>qty</AppText>
          </View>
        ))
      ) : (
        <>
          <AppText style={styles.noTransactionText}>
            No transactions were made
          </AppText>
        </>
      )}
    </>
  );
};

export const TransactionHistory = TransactionHistoryComponent;
