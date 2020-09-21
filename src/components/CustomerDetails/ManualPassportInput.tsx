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
  const [selectedCountry, setSelectedCountry] = useState<DropdownItem | null>(
    null
  );
  const [passportNo, setPassportNo] = useState<string | null>(null);

  const onItemSelection = (item: DropdownItem): void => {
    setSelectedCountry(item);
  };

  const onPassportNoChanged = (passportNo: string): void => {
    setPassportNo(passportNo);
  };

  useEffect(() => {
    if (selectedCountry && passportNo)
      setIdInput(`${selectedCountry?.id}-${passportNo}`);
  }, [selectedCountry, passportNo, setIdInput]);

  return (
    <View style={styles.centeredView}>
      <View style={styles.inputAndButtonWrapper}>
        <View style={styles.inputWrapper}>
          <DropdownFilterInput
            label="Country of nationality"
            placeholder="Search Country"
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
            value={passportNo ? passportNo : undefined}
            onChange={({ nativeEvent: { text } }) => onPassportNoChanged(text)}
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
