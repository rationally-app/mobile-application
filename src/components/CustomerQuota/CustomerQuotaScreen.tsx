import React, { FunctionComponent, useState } from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";
import { NavigationProps } from "../../types";
import { replaceRouteFn } from "../../common/navigation";
import { Header } from "../Layout/Header";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { fontSize } from "../../common/styles";

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
  const [quantity, setQuantity] = useState("");

  const onRecordTransaction = () => {
    replaceRouteFn(navigation, "TransactionConfirmationScreen")();
  };

  const onCancel = () => {
    navigation.goBack();
  };

  return (
    <View>
      <Header>
        <Text style={styles.headerText}>Make Purchase</Text>
      </Header>
      <Text>Enter quantity to buy...</Text>
      <TextInput
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
