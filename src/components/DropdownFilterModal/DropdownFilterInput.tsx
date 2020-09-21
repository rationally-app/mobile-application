import React, { useState, FunctionComponent } from "react";
import { StyleSheet, Text, View } from "react-native";
import { size, fontSize, borderRadius, color } from "../../common/styles";
import { AppText } from "../Layout/AppText";
import { DropdownFilterModal, DropdownItem } from "./DropdownFilterModal";

const styles = StyleSheet.create({
  inputAndButtonWrapper: {
    marginTop: size(3),
    flexDirection: "row",
    alignItems: "flex-end"
  },
  inputWrapper: {
    flex: 1,
    marginRight: size(1)
  }
});

export interface DropdownFilterInput {
  label: string;
  placeholder: string;
  value: string;
  dropdownItems: DropdownItem[];
  onTitleSelection: (title: string) => void;
}

export const DropdownFilterInput: FunctionComponent<DropdownFilterInput> = ({
  label,
  placeholder,
  value,
  dropdownItems,
  onTitleSelection
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const closeModal = (): void => {
    setModalVisible(false);
  };

  return (
    <View style={styles.inputAndButtonWrapper}>
      <DropdownFilterModal
        isVisible={modalVisible}
        dropdownItems={dropdownItems}
        onTitleSelection={onTitleSelection}
        closeModal={closeModal}
      />
      <View style={styles.inputWrapper}>
        <AppText style={{ fontFamily: "brand-bold" }}>{label}</AppText>
        <View
          onTouchStart={() => {
            setModalVisible(true);
          }}
          style={{
            marginTop: size(1),
            minHeight: size(6),
            borderRadius: borderRadius(2),
            borderWidth: 1,
            backgroundColor: color("grey", 0),
            borderColor: color("blue", 50)
          }}
        >
          <Text
            style={{
              fontFamily: "brand-regular",
              fontSize: fontSize(0),
              marginTop: size(1),
              marginLeft: size(1),
              alignItems: "center",
              color: color("blue", 50)
            }}
          >
            {value}
          </Text>
        </View>
      </View>
    </View>
  );
};
