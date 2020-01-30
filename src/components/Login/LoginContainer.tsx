import React, { useState, FunctionComponent } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { NavigationProps } from "../../types";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { Header } from "../Layout/Header";
import { fontSize } from "../../common/styles";
import { authenticate } from "../../services/auth";

const styles = StyleSheet.create({
  headerText: {
    fontWeight: "bold",
    fontSize: fontSize(1),
    flex: 1,
    textAlign: "center",
    alignSelf: "center"
  }
});

// TODO need to set context for auth

export const InitialisationContainer: FunctionComponent<NavigationProps> = ({
  navigation
}: NavigationProps) => {
  const [authKey, setAuthKey] = useState("");
  const [loginEnable, setLoginEnable] = useState(true);

  const onLogin = async (): Promise<void> => {
    if (!loginEnable) return;
    setLoginEnable(false);
    try {
      console.log(`Logging in with ${authKey}`);
      const authenticated = await authenticate(authKey);
      if (authenticated) {
        setLoginEnable(true);
        navigation.navigate("CollectCustomerDetailsScreen");
      } else {
        throw new Error("Authentication key is invalid");
      }
    } catch (e) {
      alert(e.message || e);
      setLoginEnable(true);
    }
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
