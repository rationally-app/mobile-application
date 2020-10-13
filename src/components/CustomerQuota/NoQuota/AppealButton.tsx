import React, { FunctionComponent } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { AppText } from "../../Layout/AppText";
import { size } from "../../../common/styles";
import { useTranslate } from "../../../hooks/useTranslate/useTranslate";

const styles = StyleSheet.create({
  appealButtonText: {
    marginTop: size(1),
    marginBottom: 0,
    fontFamily: "brand-bold",
    fontSize: size(2)
  }
});

export const AppealButton: FunctionComponent<{
  onAppeal: () => void;
}> = ({ onAppeal }) => {
  const { i18nt } = useTranslate();
  return (
    <TouchableOpacity onPress={onAppeal}>
      <View style={{ alignItems: "center" }}>
        <AppText style={styles.appealButtonText}>
          {i18nt("customerAppealScreen", "raiseAppeal")}
        </AppText>
      </View>
    </TouchableOpacity>
  );
};
