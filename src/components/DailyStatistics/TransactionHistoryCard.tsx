import React, { FunctionComponent } from "react";
import { size, fontSize, color } from "../../common/styles";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { AppText } from "../Layout/AppText";
import { Card } from "../Layout/Card";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { formatQuantityText } from "../CustomerQuota/utils";

interface TransactionHistoryCardComponent {
  transactionHistory: {
    name: string;
    category: string;
    quantity: number;
    unit: { type: "PREFIX" | "POSTFIX"; label: string };
    descriptionAlert?: string;
  }[];
  loading: boolean;
}
const styles = StyleSheet.create({
  stats: {
    flexDirection: "column",
    marginTop: -size(0.5),
    minHeight: "20%",
  },
  categoryName: {
    fontFamily: "brand-bold",
    fontSize: fontSize(0),
    marginBottom: size(3),
  },
  unit: {
    fontFamily: "brand-bold",
    fontSize: fontSize(0),
    marginBottom: size(3),
  },
  transactionText: {
    flexDirection: "row",
    display: "flex",
    justifyContent: "space-between",
  },
  noTransactionText: {
    fontFamily: "brand-bold",
    fontSize: fontSize(0),
    marginBottom: size(3),
    flexDirection: "row",
    textAlign: "center",
  },
  reasonAlert: {
    marginLeft: size(1.5),
    marginTop: -size(3),
    marginBottom: size(3),
    fontFamily: "brand-italic",
    color: color("red", 50),
  },
  descriptionAlertText: {
    alignItems: "flex-end",
  },
});

export const TransactionHistoryCardComponent: FunctionComponent<TransactionHistoryCardComponent> = ({
  transactionHistory,
  loading,
}) => {
  const { c13nt, i18nt, c13ntForUnit } = useTranslate();
  return (
    <Card style={styles.stats}>
      {!loading ? (
        transactionHistory.length !== 0 ? (
          transactionHistory.map((item) => (
            <View key={item.category}>
              <View style={styles.transactionText}>
                <AppText style={styles.categoryName}>
                  {c13nt(item.name)}
                </AppText>
                <View style={styles.transactionText}>
                  <AppText style={styles.unit}>
                    {formatQuantityText(item.quantity, c13ntForUnit(item.unit))}
                  </AppText>
                </View>
              </View>
              <View style={styles.descriptionAlertText}>
                <AppText style={styles.reasonAlert}>
                  {c13nt(item.descriptionAlert ?? "")}
                </AppText>
              </View>
            </View>
          ))
        ) : (
          <>
            <AppText style={styles.noTransactionText}>
              {i18nt("redemptionStats", "noItemsScanned")}
            </AppText>
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
