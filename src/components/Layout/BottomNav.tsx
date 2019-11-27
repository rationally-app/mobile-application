import React, { FunctionComponent } from "react";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { View, TouchableOpacity } from "react-native";
import { DARK } from "../../common/colors";
import { NavigationProps } from "../../types";
import { replaceRouteFn } from "../../common/navigation";

export interface NavTab {
  onPress: () => void;
}

export const NavTab: FunctionComponent<NavTab> = ({ children, onPress }) => {
  return (
    <TouchableOpacity
      testID="nav-tab"
      onPress={onPress}
      style={{
        width: 64,
        height: 32,
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      {children}
    </TouchableOpacity>
  );
};

export const BottomNav: FunctionComponent<NavigationProps> = ({
  navigation
}) => {
  return (
    <View
      style={{
        width: "100%",
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "space-around",
        borderTopColor: DARK,
        borderTopWidth: 1,
        borderStyle: "solid",
        paddingVertical: 5
      }}
    >
      <NavTab onPress={replaceRouteFn(navigation, "DocumentListScreen")}>
        <AntDesign name="home" size={24} style={{ color: DARK }} />
      </NavTab>
      <NavTab onPress={replaceRouteFn(navigation, "QrScannerScreen")}>
        <FontAwesome name="qrcode" size={24} style={{ color: DARK }} />
      </NavTab>
      <NavTab onPress={replaceRouteFn(navigation, "SETTING")}>
        <AntDesign name="setting" size={24} style={{ color: DARK }} />
      </NavTab>
    </View>
  );
};
