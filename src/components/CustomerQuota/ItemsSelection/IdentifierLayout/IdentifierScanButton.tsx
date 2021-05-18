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
}> = ({ disabled, fullWidth, onPress }) => (
  <View style={sharedStyles.buttonWrapper}>
    <DarkButton
      icon={
        <Feather name="maximize" size={size(2.5)} color={color("grey", 0)} />
      }
      disabled={disabled}
      fullWidth={fullWidth}
      onPress={onPress}
    />
  </View>
);
