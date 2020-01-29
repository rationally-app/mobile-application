import React, { FunctionComponent, useState } from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";
import { NavigationProps } from "../../types";
import { navigateHome } from "../../common/navigation";
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
export const TransactionConfirmationScreen: FunctionComponent<NavigationProps> = ({
  navigation
}) => {

  const onNextCustomer = () => {
    navigateHome(navigation);
  };

  return (
    <View>
      <Header>
        <Text style={styles.headerText}>Transaction Confirmation</Text>
      </Header>
      <Text>Purchased!</Text>
      <Text>S7654321A</Text>
      <Text>purchase</Text>
      <Text>1 mask</Text>
      <DarkButton text="Next Customer" onPress={onNextCustomer} />
    </View>
  );
};
