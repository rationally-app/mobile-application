import React, { FunctionComponent } from "react";
import { View } from "react-native";
import { AppText } from "../../Layout/AppText";
import { styles } from "./styles";

export interface Transaction {
  transactionDate: string;
  details: string;
  quantity: string;
  order?: number;
}

export interface TransactionsByCategory {
  category: string;
  transactions: Transaction[];
}

const Transaction: FunctionComponent<Transaction> = ({
  transactionDate,
  details,
  quantity
}) => (
  <>
    <View style={styles.itemRow}>
      <AppText style={styles.itemSubheader}>{transactionDate}</AppText>
      <AppText style={styles.itemSubheader}>{quantity}</AppText>
    </View>
    {!!details && (
      <View style={styles.itemDetailWrapper}>
        <View style={styles.itemDetailBorder} />
        <AppText style={styles.itemDetail}>{details}</AppText>
      </View>
    )}
  </>
);

export const TransactionsByCategory: FunctionComponent<{
  category: string;
  transactions: Transaction[];
  maxTransactionsToDisplay: number;
}> = ({ category, transactions, maxTransactionsToDisplay }) => {
  const shouldShowCategory =
    (transactions[0].order || 0) < maxTransactionsToDisplay;
  return shouldShowCategory ? (
    <View style={styles.wrapper}>
      <View style={styles.itemRow}>
        <AppText style={styles.itemHeader}>{category}</AppText>
      </View>
      {transactions.map(
        (transaction, index) =>
          (transaction.order || 0) < maxTransactionsToDisplay && (
            <Transaction key={index} {...transaction} />
          )
      )}
    </View>
  ) : null;
};
