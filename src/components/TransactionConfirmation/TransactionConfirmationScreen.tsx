import React, { FunctionComponent } from "react";
import { View, Text, StyleSheet } from "react-native";
import { NavigationProps } from "../../types";
import { navigateHome } from "../../common/navigation";
import { Header } from "../Layout/Header";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { fontSize } from "../../common/styles";
import { Transaction } from "../../services/quota";

const styles = StyleSheet.create({
  headerText: {
    fontFamily: "brand-bold",
    fontSize: fontSize(1),
    flex: 1,
    textAlign: "center",
    alignSelf: "center"
  }
});
export const TransactionConfirmationScreen: FunctionComponent<NavigationProps> = ({
  navigation
}) => {
  const nric: string = navigation.getParam("nric");
  const transactions: Transaction[] = navigation.getParam("transactions");

  const onNextCustomer = (): void => {
    navigateHome(navigation);
  };

  return (
    <View>
      <Header>
        <Text style={styles.headerText}>Transaction Confirmation</Text>
      </Header>
      <Text>Purchased!</Text>
      <Text>{nric}</Text>
      <Text>purchase</Text>
      <Text>{JSON.stringify(transactions)}</Text>
      <DarkButton text="Next Customer" onPress={onNextCustomer} />
    </View>
  );
};
