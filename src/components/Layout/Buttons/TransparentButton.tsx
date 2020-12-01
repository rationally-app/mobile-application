import React, { FunctionComponent, ReactElement } from "react";
import { View } from "react-native";
import { color, size } from "../../../common/styles";
import { AppText } from "../AppText";
import { BaseButton } from "./BaseButton";

export interface TransparentButton {
  text: string;
  onPress?: () => void;
  icon?: ReactElement;
  accessibilityLabel?: string;
}

export const TransparentButton: FunctionComponent<TransparentButton> = ({
  onPress,
  text,
  icon,
  accessibilityLabel,
}) => (
  <BaseButton
    onPress={onPress}
    backgroundColor="transparent"
    accessibilityLabel={accessibilityLabel}
  >
    <View
      style={{
        marginTop: size(3),
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {icon && <View style={{ marginRight: size(1) }}>{icon}</View>}
      <AppText
        style={{
          color: color("grey", 0),
          fontFamily: "brand-regular",
          textAlign: "center",
        }}
      >
        {text}
      </AppText>
    </View>
  </BaseButton>
);
