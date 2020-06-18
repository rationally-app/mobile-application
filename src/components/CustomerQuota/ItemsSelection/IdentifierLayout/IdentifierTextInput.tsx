import React, { FunctionComponent } from "react";
import { TextInputType } from "../../../../types";
import { View } from "react-native";
import { size } from "../../../../common/styles";
import { InputWithLabel } from "../../../Layout/InputWithLabel";
import { sharedStyles } from "./sharedStyles";

export const IdentifierTextInput: FunctionComponent<{
  addMarginRight: boolean;
  editable: boolean;
  label: string;
  onChange: (text: string) => void;
  type: TextInputType | undefined;
  value: string;
}> = ({ addMarginRight, editable, label, onChange, type, value }) => (
  <View
    style={[
      sharedStyles.inputWrapper,
      ...(addMarginRight ? [{ marginRight: size(1) }] : [])
    ]}
  >
    <InputWithLabel
      label={label}
      value={value}
      editable={editable}
      onChange={({ nativeEvent: { text } }) => onChange(text)}
      keyboardType={type === "NUMBER" ? "phone-pad" : "default"}
    />
  </View>
);
