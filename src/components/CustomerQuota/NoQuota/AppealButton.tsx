import React, { FunctionComponent } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { AppText } from "../../Layout/AppText";
import { size } from "../../../common/styles";

export const styles = StyleSheet.create({
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
  return (
    <TouchableOpacity onPress={onAppeal}>
      <View style={{ alignItems: "center" }}>
        <AppText style={styles.appealButtonText}>Raise an appeal</AppText>
      </View>
    </TouchableOpacity>
  );
};
