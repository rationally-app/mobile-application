import React, { useState, FunctionComponent } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { NavigationProps } from "../../types";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { Header } from "../Layout/Header";
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

export const InitialisationContainer: FunctionComponent<NavigationProps> = ({
  navigation
}: NavigationProps) => {
  const [authKey, setAuthKey] = useState("");

  const onLogin = (): void => {
    console.log(`Logging in with ${authKey}`);
    navigation.navigate("CollectCustomerDetailsScreen");
  };

  return (
    <View
      style={{
        width: "100%",
        height: "100%"
      }}
    >
      <Header>
        <Text style={styles.headerText}>Login</Text>
      </Header>
      <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        value={authKey}
        onChange={({ nativeEvent: { text } }) => setAuthKey(text)}
      />
      <DarkButton text="Login" onPress={onLogin} />
    </View>
  );
};
