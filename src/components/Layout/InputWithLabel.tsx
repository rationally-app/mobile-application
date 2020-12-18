import React, { FunctionComponent } from "react";
import { TextInput, StyleSheet, TextInputProps } from "react-native";
import { size, color, borderRadius, fontSize } from "../../common/styles";
import { AppText } from "./AppText";

const styles = StyleSheet.create({
  label: {
    fontFamily: "brand-bold"
  },
  input: {
    minHeight: size(6),
    paddingHorizontal: size(1),
    marginTop: size(1),
    borderWidth: 1,
    borderRadius: borderRadius(2),
    fontFamily: "brand-regular",
    fontSize: fontSize(0)
  },
  inputEditable: {
    backgroundColor: color("grey", 0),
    borderColor: color("blue", 50),
    color: color("blue", 50)
  },
  inputNotEditable: {
    backgroundColor: color("grey", 10),
    borderColor: color("grey", 40),
    color: color("grey", 40)
  }
});

interface InputWithLabel extends TextInputProps {
  label: string;
  editable?: boolean;
}

export const InputWithLabel: FunctionComponent<InputWithLabel> = ({
  label,
  editable = true,
  ...props
}) => (
  <>
    <AppText style={styles.label}>{label}</AppText>
    <TextInput
      style={[
        styles.input,
        ...(editable ? [styles.inputEditable] : [styles.inputNotEditable])
      ]}
      editable={editable}
      {...props}
    />
  </>
);
