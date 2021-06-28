import React, { FunctionComponent, useState, useEffect } from "react";
import { View } from "react-native";

import { size } from "../../../../common/styles";
import { useTranslate } from "../../../../hooks/useTranslate/useTranslate";
import { PolicyChoices } from "../../../../types";
import { DropdownFilterInput } from "../../../DropdownFilterModal/DropdownFilterInput";
import { sharedStyles } from "./sharedStyles";

export const IdentifierSelectionInput: FunctionComponent<{
  addMarginRight: boolean;
  label: string;
  onSelectDropdown: (choice: string) => void;
  dropdownItems?: PolicyChoices[];
}> = ({ addMarginRight, label, onSelectDropdown, dropdownItems = [] }) => {
  const { c13nt } = useTranslate();
  const [selectedChoice, setSelectedChoice] = useState<PolicyChoices>();

  const onItemSelection = (item: PolicyChoices): void => {
    setSelectedChoice(item);
  };

  useEffect(() => {
    selectedChoice
      ? onSelectDropdown(selectedChoice.value)
      : onSelectDropdown("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChoice]);

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
        value={`${c13nt(selectedChoice?.value)}`}
        dropdownItems={dropdownItems}
        onItemSelection={onItemSelection}
      />
    </View>
  );
};
