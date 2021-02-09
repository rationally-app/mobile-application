import React, { FunctionComponent } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
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

export const ShowChargeableItemsToggle: FunctionComponent<{
  descriptionAlert: string;
  toggleIsShowChargeableItems: () => void;
  isShowChargeableItems: boolean;
}> = ({
  descriptionAlert,
  toggleIsShowChargeableItems,
  isShowChargeableItems,
}) => {
  return (
    <TouchableOpacity onPress={toggleIsShowChargeableItems}>
      <AppText style={styles.descriptionAlert}>
        {`${descriptionAlert} `}
        <MaterialCommunityIcons
          name={isShowChargeableItems ? "chevron-up" : "chevron-down"}
          size={size(2)}
        />
      </AppText>
    </TouchableOpacity>
  );
};
