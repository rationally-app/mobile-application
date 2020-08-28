import React, { FunctionComponent } from "react";
import { View, TouchableOpacity } from "react-native";
import { AppText } from "../../Layout/AppText";
import { size } from "../../../common/styles";
import { styles } from "./styles";

export const ShowFullListToggle: FunctionComponent<{
  onClick: () => void;
  displayText: string;
  icon: any;
}> = ({ onClick, displayText, icon }) => (
  <View
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginTop: size(2),
      marginBottom: size(2)
    }}
  >
    <TouchableOpacity
      onPress={onClick}
      style={styles.showFullListToggleWrapper}
    >
      <View style={styles.showFullListToggleBorder} />
      {icon}
      <View style={styles.showFullListToggleBorder} />
    </TouchableOpacity>
    <AppText style={styles.itemHeader}>{displayText}</AppText>
  </View>
);
