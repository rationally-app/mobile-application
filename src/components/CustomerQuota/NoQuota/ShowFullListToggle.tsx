import React, { FunctionComponent } from "react";
import { View, TouchableOpacity } from "react-native";
import { AppText } from "../../Layout/AppText";
import { size, color } from "../../../common/styles";
import { styles } from "./styles";
import { Ionicons } from "@expo/vector-icons";

export const ShowFullListToggle: FunctionComponent<{
  toggleIsShowFullList: () => void;
  isShowFullList: boolean;
}> = ({ toggleIsShowFullList, isShowFullList }) => (
  <View
    style={{
      display: "flex",
      justifyContent: "center",
      marginTop: size(2),
      marginBottom: size(2)
    }}
  >
    <TouchableOpacity
      onPress={toggleIsShowFullList}
      style={{ alignItems: "center" }}
    >
      <View style={styles.showFullListToggleWrapper}>
        <View style={styles.showFullListToggleBorder} />
        <Ionicons
          name={
            isShowFullList
              ? "ios-arrow-dropup-circle"
              : "ios-arrow-dropdown-circle"
          }
          size={size(4)}
          color={color("blue", 50)}
        />
        <View style={styles.showFullListToggleBorder} />
      </View>
      <AppText style={styles.itemHeader}>{`Show ${
        isShowFullList ? "less" : "more"
      }`}</AppText>
    </TouchableOpacity>
  </View>
);
