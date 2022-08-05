import React, { useState, FunctionComponent } from "react";
import { StyleSheet, View, TextInput } from "react-native";
import { size, borderRadius, color, fontSize } from "../../common/styles";
import { PolicyChoices } from "../../types";
import { AppText } from "../Layout/AppText";
import { DropdownFilterModal } from "./DropdownFilterModal";

const styles = StyleSheet.create({
  label: {
    fontFamily: "brand-bold",
  },
  inputView: {
    marginTop: size(1),
    minHeight: size(6),
    borderRadius: borderRadius(2),
    borderWidth: 1,
    backgroundColor: color("grey", 0),
    borderColor: color("blue", 50),
  },
  inputText: {
    minHeight: size(6),
    paddingHorizontal: size(1),
    fontFamily: "brand-regular",
    fontSize: fontSize(0),
    color: color("blue", 50),
  },
});

export interface DropdownFilterInput {
  label: string;
  placeholder: string;
  value?: string;
  dropdownItems: PolicyChoices[];
  onItemSelection: (item: PolicyChoices) => void;
}

export const DropdownFilterInput: FunctionComponent<DropdownFilterInput> = ({
  label,
  placeholder,
  value,
  dropdownItems,
  onItemSelection,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = (): void => {
    setModalVisible(true);
  };

  const closeModal = (): void => {
    setModalVisible(false);
  };

  return (
    <View>
      <DropdownFilterModal
        isVisible={modalVisible}
        dropdownItems={dropdownItems}
        label={label}
        placeholder={placeholder}
        onItemSelection={onItemSelection}
        closeModal={closeModal}
      />
      <AppText style={styles.label}>{label}</AppText>
      {/* need a View because Android is not able to response to onTouchStart on a non-editable TextInput*/}
      <View
        testID={"dropdown-filter-view"}
        onTouchStart={() => {
          openModal();
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
