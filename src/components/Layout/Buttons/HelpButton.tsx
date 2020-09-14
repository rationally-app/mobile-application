import React, { FunctionComponent } from "react";
import { Feather } from "@expo/vector-icons";
import { AppText } from "../AppText";
import { size, fontSize, color } from "../../../common/styles";
import { TouchableOpacity } from "react-native";
import i18n from "i18n-js";

export const HelpButton: FunctionComponent<{ onPress: () => void }> = ({
  onPress
}) => {
  return (
    <TouchableOpacity
      style={{
        alignSelf: "center",
        flexDirection: "row",
        paddingHorizontal: size(4),
        paddingVertical: size(3)
      }}
      onPress={onPress}
    >
      <AppText
        style={{
          textAlign: "center",
          fontFamily: "brand-italic",
          fontSize: fontSize(-1),
          color: color("blue", 40)
        }}
      >
        <Feather name="compass" size={size(1.5)} color={color("blue", 40)} />
        {` ${i18n.t("loginScanCard.needHelp")}`}
      </AppText>
    </TouchableOpacity>
  );
};
