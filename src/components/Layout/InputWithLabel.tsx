import React, { FunctionComponent } from "react";
import { TextInput, View, StyleSheet, TextInputProps } from "react-native";
import { size, color, borderRadius, fontSize } from "../../common/styles";
import { useTheme } from "../../context/theme";
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
  },
  inputEditable: {
    backgroundColor: color("grey", 0),
  },
  inputNotEditable: {
    backgroundColor: color("grey", 10),
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
}) => {
  const { theme } = useTheme();
  return (
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
          ...(editable
            ? [
                {
                  ...styles.inputEditable,
                  color: theme.inputWithLabel.editableInputTextColor,
                  borderColor: theme.inputWithLabel.editableInputBorderColor,
                },
              ]
            : [
                {
                  ...styles.inputNotEditable,
                  color: theme.inputWithLabel.notEditableInputTextColor,
                  borderColor: theme.inputWithLabel.notEditableInputBorderColor,
                },
              ]),
        ]}
        editable={editable}
        accessibilityLabel={`${accessibilityLabel}-input`}
        testID={`${accessibilityLabel}-input`}
        accessible={true}
        {...props}
      />
    </View>
  );
};
