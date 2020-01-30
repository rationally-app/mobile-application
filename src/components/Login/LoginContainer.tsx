import React, { useState, FunctionComponent } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { NavigationProps } from "../../types";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { Header } from "../Layout/Header";
import { fontSize } from "../../common/styles";
import { authenticate } from "../../services/auth";
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

export const InitialisationContainer: FunctionComponent<NavigationProps> = ({
  navigation
}: NavigationProps) => {
  const { setAuthKey } = useAuthenticationContext();
  const [inputAuthKey, setInputAuthKey] = useState(__DEV__ ? "test-key" : "");
  const [loginEnable, setLoginEnable] = useState(true);

  const onLogin = async (): Promise<void> => {
    if (!loginEnable) return;
    setLoginEnable(false);
    try {
      const authenticated = await authenticate(inputAuthKey);
      if (authenticated) {
        setAuthKey(inputAuthKey);
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
        value={inputAuthKey}
        onChange={({ nativeEvent: { text } }) => setInputAuthKey(text)}
      />
      <DarkButton text="Login" onPress={onLogin} />
    </View>
  );
};
