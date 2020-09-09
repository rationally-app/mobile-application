import React, { FunctionComponent } from "react";
import { size, fontSize } from "../../common/styles";
import { StyleSheet } from "react-native";
import { AppText } from "../Layout/AppText";
import { ItemQuantity } from "./types";

interface TransactionHistoryComponent {
  transactionHistory: ItemQuantity[] | null;
}

const styles = StyleSheet.create({
  categoryName: {
    fontFamily: "brand-bold",
    fontSize: fontSize(1),
    marginBottom: size(3),
    flexDirection: "row"
  },
  quantity: {
    flexDirection: "row"
  }
});

export const TransactionHistoryComponent: FunctionComponent<TransactionHistoryComponent> = ({
  transactionHistory
}) => {
  return (
    <>
      {transactionHistory ? (
        transactionHistory.map(item => (
          <>
            <AppText style={styles.categoryName}>{item.category}</AppText>
            <AppText style={styles.quantity}>{item.quantity}</AppText>
          </>
        ))
      ) : (
        <>
          <AppText style={styles.categoryName}>
            No transactions were made
          </AppText>
        </>
      )}
    </>
  );
};

export const TransactionHistory = TransactionHistoryComponent;
