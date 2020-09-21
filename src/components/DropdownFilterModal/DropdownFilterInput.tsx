import React, { useState, FunctionComponent } from "react";
import { StyleSheet, View, TextInput } from "react-native";
import { size, fontSize, borderRadius, color } from "../../common/styles";
import { AppText } from "../Layout/AppText";
import { DropdownFilterModal, DropdownItem } from "./DropdownFilterModal";

const styles = StyleSheet.create({
  label: {
    fontFamily: "brand-bold"
  },
  inputView: {
    marginTop: size(1),
    minHeight: size(6),
    borderRadius: borderRadius(2),
    borderWidth: 1,
    backgroundColor: color("grey", 0),
    borderColor: color("blue", 50)
  },
  inputText: {
    fontFamily: "brand-regular",
    fontSize: fontSize(0),
    marginTop: size(1),
    marginLeft: size(1),
    alignItems: "center",
    color: color("blue", 50)
  }
});

export interface DropdownFilterInput {
  label: string;
  placeholder: string;
  value?: string;
  dropdownItems: DropdownItem[];
  onItemSelection: (title: string) => void;
}

export const DropdownFilterInput: FunctionComponent<DropdownFilterInput> = ({
  label,
  placeholder,
  value,
  dropdownItems,
  onItemSelection
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const closeModal = (): void => {
    setModalVisible(false);
  };

  return (
    <View>
      <DropdownFilterModal
        isVisible={modalVisible}
        dropdownItems={dropdownItems}
        onTitleSelection={onItemSelection}
        closeModal={closeModal}
      />
      <AppText style={styles.label}>{label}</AppText>
      <View
        onTouchStart={() => {
          setModalVisible(true);
        }}
        style={styles.inputView}
      >
        <TextInput
          style={styles.inputText}
          placeholder={placeholder}
          editable={false}
        >
          {value}
        </TextInput>
      </View>
    </View>
  );
};
