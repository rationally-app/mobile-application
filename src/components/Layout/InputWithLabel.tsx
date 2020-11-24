import React, { FunctionComponent } from "react";
import { TextInput, View, StyleSheet, TextInputProps } from "react-native";
import { size, color, borderRadius, fontSize } from "../../common/styles";
import { lineHeight } from "../../common/styles/typography";
import { AppText } from "./AppText";

const styles = StyleSheet.create({
  label: {
    fontFamily: "brand-bold",
  },
  input: {
    minHeight: size(6),
    paddingHorizontal: size(1),
    marginTop: size(1),
    borderWidth: 1,
    borderRadius: borderRadius(2),
    fontFamily: "brand-regular",
    fontSize: fontSize(0),
    lineHeight: lineHeight(0, false),
  },
  inputEditable: {
    backgroundColor: color("grey", 0),
    borderColor: color("grey", 40),
    color: color("grey", 80),
  },
  inputNotEditable: {
    backgroundColor: color("grey", 10),
    borderColor: color("grey", 40),
    color: color("grey", 40),
  },
});

interface InputWithLabel extends TextInputProps {
  label: string;
  editable?: boolean;
  accessibilityLabel?: string;
}

export const InputWithLabel: FunctionComponent<InputWithLabel> = ({
  label,
  editable = true,
  accessibilityLabel = "input-with-label",
  ...props
}) => (
  <View>
    <AppText
      style={styles.label}
      accessibilityLabel={`${accessibilityLabel}-label`}
      testID={`${accessibilityLabel}-label`}
      accessible={true}
    >
      {label}
    </AppText>
    <TextInput
      style={[
        styles.input,
        ...(editable ? [styles.inputEditable] : [styles.inputNotEditable]),
      ]}
      editable={editable}
      accessibilityLabel={`${accessibilityLabel}-input`}
      testID={`${accessibilityLabel}-input`}
      accessible={true}
      {...props}
    />
  </View>
);
