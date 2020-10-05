import React, { FunctionComponent } from "react";
import { size, fontSize, color } from "../../common/styles";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { AppText } from "../Layout/AppText";
import { Card } from "../Layout/Card";

interface TransactionHistoryCardComponent {
  transactionHistory: {
    name: string;
    category: string;
    quantityText: string;
  }[];
  loading: boolean;
}

const styles = StyleSheet.create({
  stats: {
    flexDirection: "column",
    marginTop: -size(0.5),
    minHeight: "20%"
  },
  categoryName: {
    fontFamily: "brand-bold",
    fontSize: fontSize(0),
    marginBottom: size(3)
  },
  quantityText: {
    fontFamily: "brand-bold",
    fontSize: fontSize(0),
    marginBottom: size(3)
  },
  transactionText: {
    flexDirection: "row",
    display: "flex",
    justifyContent: "space-between"
  },
  noTransactionText: {
    fontFamily: "brand-bold",
    fontSize: fontSize(0),
    marginBottom: size(3),
    flexDirection: "row",
    textAlign: "center"
  }
});

export const TransactionHistoryCardComponent: FunctionComponent<TransactionHistoryCardComponent> = ({
  transactionHistory,
  loading
}) => {
  return (
    <Card style={styles.stats}>
      {!loading ? (
        transactionHistory.length !== 0 ? (
          transactionHistory.map(item => (
            <View style={styles.transactionText} key={item.category}>
              <AppText style={styles.categoryName}>{item.name}</AppText>
              <View style={styles.transactionText}>
                <AppText style={styles.quantityText}>
                  {item.quantityText}
                </AppText>
              </View>
            </View>
          ))
        ) : (
          <>
            <AppText style={styles.noTransactionText}>No items scanned</AppText>
          </>
        )
      ) : (
        <ActivityIndicator
          style={{ alignItems: "center" }}
          size="large"
          color={color("grey", 40)}
        />
      )}
    </Card>
  );
};

export const TransactionHistoryCard = TransactionHistoryCardComponent;
