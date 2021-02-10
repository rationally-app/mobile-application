import React, { FunctionComponent } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { color, size } from "../../../common/styles";
import { AppText } from "../../Layout/AppText";

const styles = StyleSheet.create({
  descriptionAlert: {
    fontFamily: "brand-italic",
    color: color("red", 50),
    marginTop: size(2),
  },
});

export const ShowAddonsToggle: FunctionComponent<{
  descriptionAlert: string;
  toggleIsShowAddons: (e: GestureResponderEvent) => void;
  isShowAddons: boolean;
}> = ({ descriptionAlert, toggleIsShowAddons, isShowAddons }) => {
  return (
    <TouchableOpacity onPress={toggleIsShowAddons}>
      <AppText style={styles.descriptionAlert}>
        {`${descriptionAlert} `}
        <MaterialCommunityIcons
          name={isShowAddons ? "chevron-up" : "chevron-down"}
          size={size(2)}
        />
      </AppText>
    </TouchableOpacity>
  );
};
