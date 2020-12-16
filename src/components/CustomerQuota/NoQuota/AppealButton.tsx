import React, { FunctionComponent } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { AppText } from "../../Layout/AppText";
import { size } from "../../../common/styles";
import { useTranslate } from "../../../hooks/useTranslate/useTranslate";
import { fontSize, lineHeight } from "../../../common/styles/typography";

const styles = StyleSheet.create({
  appealButtonText: {
    marginTop: size(1),
    marginBottom: 0,
    fontFamily: "brand-bold",
    fontSize: fontSize(2),
    lineHeight: lineHeight(2),
  },
});

export const AppealButton: FunctionComponent<{
  onAppeal: () => void;
}> = ({ onAppeal }) => {
  const { i18nt } = useTranslate();
  return (
    <TouchableOpacity
      onPress={onAppeal}
      accessibilityLabel="raise-appeal-button"
      testID="raise-appeal-button"
    >
      <View style={{ alignItems: "center" }}>
        <AppText
          style={styles.appealButtonText}
          accessibilityLabel="raise-appeal"
          testID="raise-appeal"
          accessible={true}
        >
          {i18nt("customerAppealScreen", "raiseAppeal")}
        </AppText>
      </View>
    </TouchableOpacity>
  );
};
