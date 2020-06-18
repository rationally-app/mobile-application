import React, { FunctionComponent } from "react";
import { View } from "react-native";
import { DarkButton } from "../../../Layout/Buttons/DarkButton";
import { size, color } from "../../../../common/styles";
import { sharedStyles } from "./sharedStyles";
import { Feather } from "@expo/vector-icons";

export const IdentifierScanButton: FunctionComponent<{
  disabled: boolean;
  fullWidth: boolean;
  onPress: () => void;
  text: string | undefined;
}> = ({ disabled, fullWidth, onPress, text }) => (
  <View style={sharedStyles.buttonWrapper}>
    <DarkButton
      text={text || "Scan"}
      icon={<Feather name="maximize" size={size(2)} color={color("grey", 0)} />}
      disabled={disabled}
      fullWidth={fullWidth}
      onPress={onPress}
    />
  </View>
);
