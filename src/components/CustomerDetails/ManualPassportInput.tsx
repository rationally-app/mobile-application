import React, { useState, FunctionComponent } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
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
  modalView: {
    paddingHorizontal: 0,
    marginBottom: 0,
    padding: 0,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
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

export interface AlertModalProps {
  alertType: string;
  title: string;
  description: string;
  visible: boolean;
}

export const ManualPassportInput: FunctionComponent<{
  idInput: string;
  setIdInput: (id: string) => void;
  submitId: () => void;
}> = ({ idInput, setIdInput, submitId }) => {
  const [selectedCountry, setSelectedCountry] = useState("Search country");

  const onTitleSelection = (title: string): void => {
    setSelectedCountry(title);
  };

  return (
    <View style={styles.centeredView}>
      <DropdownFilterInput
        label="Country of nationality"
        placeholder="placeholder"
        value={selectedCountry}
        dropdownItems={nationalityItems}
        onTitleSelection={onTitleSelection}
      />
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
