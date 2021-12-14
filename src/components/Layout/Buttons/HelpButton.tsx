import React, { FunctionComponent } from "react";
import { Feather } from "@expo/vector-icons";
import { AppText } from "../AppText";
import { size, fontSize } from "../../../common/styles";
import { TouchableOpacity } from "react-native";
import { useTranslate } from "../../../hooks/useTranslate/useTranslate";
import { useTheme } from "../../../context/theme";

export const HelpButton: FunctionComponent<{ onPress: () => void }> = ({
  onPress,
}) => {
  const { theme } = useTheme();
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
          color: theme.collectCustomerDetails.needHelpText,
        }}
      >
        <Feather
          name="compass"
          size={size(1.5)}
          color={theme.collectCustomerDetails.needHelpIcon}
        />
        {` ${i18nt("loginScanCard", "needHelp")} `}
      </AppText>
    </TouchableOpacity>
  );
};
