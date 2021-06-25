import React, { FunctionComponent, useState, useEffect } from "react";
import { View } from "react-native";

import { size } from "../../../../common/styles";
import { PolicyChoices } from "../../../../types";
import { DropdownFilterInput } from "../../../DropdownFilterModal/DropdownFilterInput";
import { sharedStyles } from "./sharedStyles";

export const IdentifierSelectionInput: FunctionComponent<{
  addMarginRight: boolean;
  label: string;
  setInputValue: (id: string) => void;
  dropdownItems?: PolicyChoices[];
}> = ({ addMarginRight, label, setInputValue, dropdownItems = [] }) => {
  const [selectedChoice, setSelectedChoice] = useState<PolicyChoices>();

  const onItemSelection = (item: PolicyChoices): void => {
    setSelectedChoice(item);
  };

  useEffect(() => {
    selectedChoice ? setInputValue(selectedChoice.label) : setInputValue("");
  }, [selectedChoice, setInputValue]);

  return (
    <View
      style={[
        sharedStyles.inputWrapper,
        ...(addMarginRight ? [{ marginRight: size(1) }] : []),
      ]}
    >
      <DropdownFilterInput
        label={label}
        placeholder="Select reason"
        value={selectedChoice?.label}
        dropdownItems={dropdownItems}
        onItemSelection={onItemSelection}
      />
    </View>
  );
};
