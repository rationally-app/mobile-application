import React, { FunctionComponent } from "react";
import { Feather } from "@expo/vector-icons";
import { AppText } from "../AppText";
import { size, fontSize, color } from "../../../common/styles";
import { TouchableOpacity } from "react-native";
import { useTranslate } from "../../../hooks/useTranslate/useTranslate";
import { lineHeight } from "../../../common/styles/typography";

export const HelpButton: FunctionComponent<{ onPress: () => void }> = ({
  onPress,
}) => {
  const { i18nt } = useTranslate();
  return (
    <TouchableOpacity
      style={{
        alignSelf: "center",
        flexDirection: "row",
        paddingHorizontal: size(4),
        paddingVertical: size(3),
      }}
      onPress={onPress}
    >
      <AppText
        style={{
          textAlign: "center",
          fontFamily: "brand-italic",
          fontSize: fontSize(-1),
          lineHeight: lineHeight(-1),
          color: color("blue", 40),
        }}
      >
        <Feather name="compass" size={size(1.5)} color={color("blue", 40)} />
        {` ${i18nt("loginScanCard", "needHelp")}? `}
      </AppText>
    </TouchableOpacity>
  );
};
