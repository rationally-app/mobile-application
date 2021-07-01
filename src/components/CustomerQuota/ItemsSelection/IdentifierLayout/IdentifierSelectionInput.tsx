import React, { FunctionComponent, useState } from "react";
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
  const { c13nt, i18nt } = useTranslate();
  const [selectedChoice, setSelectedChoice] = useState<string>("");

  const onItemSelection = (item: PolicyChoices): void => {
    setSelectedChoice(item?.value);
    onSelectDropdown(item?.value);
  };

  return (
    <View
      style={[
        sharedStyles.inputWrapper,
        ...(addMarginRight ? [{ marginRight: size(1) }] : []),
      ]}
    >
      <DropdownFilterInput
        label={label}
        placeholder={i18nt("identifierSelectionInput", "placeholder")}
        value={c13nt(selectedChoice)}
        dropdownItems={dropdownItems}
        onItemSelection={onItemSelection}
      />
    </View>
  );
};
