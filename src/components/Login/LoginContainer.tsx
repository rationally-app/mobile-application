import React, { useState, FunctionComponent } from "react";
import { View, StyleSheet, KeyboardAvoidingView } from "react-native";
import { NavigationProps } from "../../types";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { authenticate } from "../../services/auth";
import { useAuthenticationContext } from "../../context/auth";
import { color, size } from "../../common/styles";
import { AppName } from "../Layout/AppName";
import { Card } from "../Layout/Card";
import { InputWithLabel } from "../Layout/InputWithLabel";

const styles = StyleSheet.create({
  bg: {
    backgroundColor: color("blue", 50),
    width: "100%",
    height: "50%",
    position: "absolute"
  },
  content: {
    padding: size(3),
    width: "100%",
    height: "100%",
    justifyContent: "center"
  },
  headerText: {
    marginBottom: size(3),
    textAlign: "center",
    alignSelf: "center"
  },
  inputWrapper: {
    marginBottom: size(3)
  }
});

export const InitialisationContainer: FunctionComponent<NavigationProps> = ({
  navigation
}: NavigationProps) => {
  const { setAuthKey } = useAuthenticationContext();
  const [inputAuthKey, setInputAuthKey] = useState(__DEV__ ? "test-key" : "");
  const [isLoading, setIsLoading] = useState(false);

  const onLogin = async (): Promise<void> => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const authenticated = await authenticate(inputAuthKey);
      if (authenticated) {
        setAuthKey(inputAuthKey);
        setIsLoading(false);
        navigation.navigate("CollectCustomerDetailsScreen");
      } else {
        throw new Error("Authentication key is invalid");
      }
    } catch (e) {
      alert(e.message || e);
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{
        width: "100%",
        height: "100%"
      }}
      behavior="padding"
    >
      <View style={styles.bg} />
      <View style={styles.content}>
        <View style={styles.headerText}>
          <AppName />
        </View>
        <Card>
          <View style={styles.inputWrapper}>
            <InputWithLabel
              label="Unique ID"
              value={inputAuthKey}
              onChange={({ nativeEvent: { text } }) => setInputAuthKey(text)}
            />
          </View>
          <DarkButton
            text="Login"
            onPress={onLogin}
            fullWidth={true}
            isLoading={isLoading}
          />
        </Card>
      </View>
    </KeyboardAvoidingView>
  );
};
