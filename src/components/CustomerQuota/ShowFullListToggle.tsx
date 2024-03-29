import React, { FunctionComponent } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { AppText } from "../Layout/AppText";
import { size, color, fontSize } from "../../common/styles";
import { AntDesign } from "@expo/vector-icons";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";

const styles = StyleSheet.create({
  toggleText: {
    lineHeight: 1.5 * fontSize(0),
    fontFamily: "brand-bold",
  },
  showFullListToggleBorder: {
    borderBottomWidth: 1,
    borderBottomColor: color("grey", 30),
    flex: 1,
  },
  showFullListToggleWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
});

export const ShowFullListToggle: FunctionComponent<{
  toggleIsShowFullList: () => void;
  isShowFullList: boolean;
}> = ({ toggleIsShowFullList, isShowFullList }) => {
  const { i18nt } = useTranslate();
  return (
    <View
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: size(2),
        marginBottom: size(2),
      }}
    >
      <TouchableOpacity
        onPress={toggleIsShowFullList}
        style={{ alignItems: "center" }}
      >
        <View style={styles.showFullListToggleWrapper}>
          <View style={styles.showFullListToggleBorder} />
          <AntDesign
            name={isShowFullList ? "upcircle" : "downcircle"}
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
};
