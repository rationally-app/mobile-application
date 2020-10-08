import React, { FunctionComponent } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { AppText } from "../Layout/AppText";
import { size, color, fontSize } from "../../common/styles";
import { Ionicons } from "@expo/vector-icons";
import { i18nt } from "../../utils/translations";

const styles = StyleSheet.create({
  toggleText: {
    lineHeight: 1.5 * fontSize(0),
    fontFamily: "brand-bold"
  },
  showFullListToggleBorder: {
    borderBottomWidth: 1,
    borderBottomColor: color("grey", 30),
    flex: 1
  },
  showFullListToggleWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  }
});

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
      <AppText style={styles.toggleText}>
        {isShowFullList
          ? i18nt("checkoutSuccessScreen", "showLess")
          : i18nt("checkoutSuccessScreen", "showMore")}
      </AppText>
    </TouchableOpacity>
  </View>
);
