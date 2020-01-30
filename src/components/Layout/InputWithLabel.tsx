import React, { FunctionComponent } from "react";
import { TextInput, View, StyleSheet, TextInputProps } from "react-native";
import { size, color, borderRadius } from "../../common/styles";
import { AppText } from "./AppText";

const styles = StyleSheet.create({
  label: {
    fontFamily: "inter-bold"
  },
  input: {
    height: size(6),
    paddingLeft: size(1),
    marginTop: size(1),
    backgroundColor: color("grey", 0),
    borderWidth: 1,
    borderRadius: borderRadius(2),
    borderColor: color("grey", 20)
  }
});

interface InputWithLabel extends TextInputProps {
  label: string;
}

export const InputWithLabel: FunctionComponent<InputWithLabel> = ({
  label,
  ...props
}) => (
  <View>
    <AppText style={styles.label}>{label}</AppText>
    <TextInput style={styles.input} {...props} />
  </View>
);
