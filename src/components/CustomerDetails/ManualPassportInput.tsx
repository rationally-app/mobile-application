import React, { useState, FunctionComponent } from "react";
import { StyleSheet, View } from "react-native";
import { InputWithLabel } from "../Layout/InputWithLabel";
import { size } from "../../common/styles";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { DropdownFilterInput } from "../DropdownFilterModal/DropdownFilterInput";
import { nationalityItems } from "../DropdownFilterModal/nationalityItems";

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
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

export const ManualPassportInput: FunctionComponent<{
  idInput: string;
  setIdInput: (id: string) => void;
  submitId: () => void;
}> = ({ idInput, setIdInput, submitId }) => {
  const [selectedCountry, setSelectedCountry] = useState("");

  const onItemSelection = (title: string): void => {
    setSelectedCountry(title);
  };

  return (
    <View style={styles.centeredView}>
      <View style={styles.inputAndButtonWrapper}>
        <View style={styles.inputWrapper}>
          <DropdownFilterInput
            label="Country of nationality"
            placeholder="Search Country"
            value={selectedCountry}
            dropdownItems={nationalityItems}
            onItemSelection={onItemSelection}
          />
        </View>
      </View>
      <View style={styles.inputAndButtonWrapper}>
        <View style={styles.inputWrapper}>
          <InputWithLabel
            label="Passport number"
            value={idInput}
            onChange={({ nativeEvent: { text } }) => setIdInput(text)}
            onSubmitEditing={submitId}
            autoCompleteType="off"
            autoCorrect={false}
            keyboardType={"default"}
          />
        </View>
      </View>
      <View style={styles.inputAndButtonWrapper}>
        <View style={styles.inputWrapper}>
          <DarkButton fullWidth={true} text="Submit" onPress={submitId} />
        </View>
      </View>
    </View>
  );
};
