import React, { FunctionComponent, useState } from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";
import { NavigationProps } from "../../types";
import { replaceRouteFn } from "../../common/navigation";
import { Header } from "../Layout/Header";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { fontSize } from "../../common/styles";
import { QuotaResponse, postTransaction } from "../../services/quota";
import { useAuthenticationContext } from "../../context/auth";

const styles = StyleSheet.create({
  headerText: {
    fontWeight: "bold",
    fontSize: fontSize(1),
    flex: 1,
    textAlign: "center",
    alignSelf: "center"
  }
});
export const CustomerQuotaScreen: FunctionComponent<NavigationProps> = ({
  navigation
}) => {
  const { authKey } = useAuthenticationContext();
  const quota: QuotaResponse = navigation.getParam("quota");
  const nric: string = navigation.getParam("nric");
  const [quantity, setQuantity] = useState("1");

  const onRecordTransaction = async (): Promise<void> => {
    try {
      // Checks if quantity is correct
      const qtyNum = Number(quantity);
      if (isNaN(qtyNum)) throw new Error("Invalid quantity");
      if (!Number.isInteger(qtyNum))
        throw new Error("Quantity cannot have decimals");
      if (qtyNum > quota.remainingQuota)
        throw new Error("Quantity cannot exceed quota");
      if (qtyNum <= 0) throw new Error("Quantity must be greater than 0");

      const transactions = await postTransaction(nric, qtyNum, authKey);

      replaceRouteFn(navigation, "TransactionConfirmationScreen", {
        transactions,
        nric
      })();
    } catch (e) {
      alert(e.message || e);
    }
  };

  const onCancel = (): void => {
    navigation.goBack();
  };

  return (
    <View>
      <Header>
        <Text style={styles.headerText}>Make Purchase</Text>
      </Header>
      <Text>Customer NRIC: {nric}</Text>
      <Text>{quota.remainingQuota} masks left</Text>
      <Text>Enter quantity to buy...</Text>
      <TextInput
        autoFocus={true}
        style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        value={quantity}
        onChange={({ nativeEvent: { text } }) => setQuantity(text)}
        keyboardType="numeric"
      />
      <DarkButton text="Buy Mask" onPress={onRecordTransaction} />
      <DarkButton text="Cancel" onPress={onCancel} />
    </View>
  );
};
