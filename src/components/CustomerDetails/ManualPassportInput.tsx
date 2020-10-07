import React, { useState, FunctionComponent, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { InputWithLabel } from "../Layout/InputWithLabel";
import { size } from "../../common/styles";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { DropdownFilterInput } from "../DropdownFilterModal/DropdownFilterInput";
import { nationalityItems } from "../DropdownFilterModal/nationalityItems";
import { DropdownItem } from "../DropdownFilterModal/DropdownFilterModal";

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

interface ManualPassportInput {
  setIdInput: (id: string) => void;
  submitId: () => void;
}

export const ManualPassportInput: FunctionComponent<ManualPassportInput> = ({
  setIdInput,
  submitId
}) => {
  const [selectedCountry, setSelectedCountry] = useState<DropdownItem>();
  const [passportNum, setPassportNum] = useState<string>();

  const onItemSelection = (item: DropdownItem): void => {
    setSelectedCountry(item);
  };

  const onPassportNumChanged = (passportNo: string): void => {
    setPassportNum(passportNo.toUpperCase());
  };

  useEffect(() => {
    selectedCountry && passportNum
      ? setIdInput(`${selectedCountry?.id}-${passportNum}`)
      : setIdInput("");
  }, [selectedCountry, passportNum, setIdInput]);

  return (
    <View style={styles.centeredView}>
      <View style={styles.inputAndButtonWrapper}>
        <View style={styles.inputWrapper}>
          <DropdownFilterInput
            label="Nationality (non-SGP)"
            placeholder="Search country"
            value={selectedCountry?.name}
            dropdownItems={nationalityItems}
            onItemSelection={onItemSelection}
          />
        </View>
      </View>
      <View style={styles.inputAndButtonWrapper}>
        <View style={styles.inputWrapper}>
          <InputWithLabel
            label="Passport number"
            value={passportNum ? passportNum : undefined}
            onChange={({ nativeEvent: { text } }) => onPassportNumChanged(text)}
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
