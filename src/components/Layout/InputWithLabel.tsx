import React, { FunctionComponent } from "react";
import {
  TextInput,
  Text,
  View,
  StyleSheet,
  TextInputProps
} from "react-native";
import { size, color, borderRadius, fontSize } from "../../common/styles";

const styles = StyleSheet.create({
  label: {
    fontWeight: "bold",
    fontSize: fontSize(0),
    color: color("blue", 50)
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
    <Text style={styles.label}>{label}</Text>
    <TextInput style={styles.input} {...props} />
  </View>
);
