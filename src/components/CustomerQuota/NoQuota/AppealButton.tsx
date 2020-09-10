import React, { FunctionComponent } from "react";
import { View, TouchableOpacity } from "react-native";
import { AppText } from "../../Layout/AppText";
import { styles } from "./styles";

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
