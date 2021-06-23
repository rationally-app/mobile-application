import React, { ReactElement, useState } from "react";
import { storiesOf } from "@storybook/react-native";
import { View } from "react-native";
import { size } from "../../../src/common/styles";
import { DropdownFilterModal } from "../../../src/components/DropdownFilterModal/DropdownFilterModal";
import { DropdownFilterInput } from "../../../src/components/DropdownFilterModal/DropdownFilterInput";
import { DarkButton } from "../../../src/components/Layout/Buttons/DarkButton";
import { PolicyChoices } from "../../../src/types";

const items: PolicyChoices[] = [
  // label key is must. It is to show the text in front
  { value: "A", label: "A", tag: true },
  { value: "A1", label: "angellist" },
  { value: "F", label: "F", tag: true },
  { value: "F1", label: "facebook" },
  { value: "F2", label: "foursquare" },
  { value: "G", label: "G", tag: true },
  { value: "G1", label: "github-alt" },
  { value: "G2", label: "github" },
  { value: "G3", label: "gitlab" },
  { value: "I", label: "I", tag: true },
  { value: "I1", label: "instagram" },
];

const ModalItem = (): ReactElement => {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DarkButton
          text="Show Dropdown Modal"
          onPress={() => setIsVisible(true)}
        />
      </View>
      <DropdownFilterModal
        label="Dropdown label"
        placeholder="placeholder"
        isVisible={isVisible}
        dropdownItems={items}
        onItemSelection={(item) => alert(JSON.stringify(item))}
        closeModal={() => setIsVisible(false)}
      />
    </View>
  );
};

storiesOf("Layout/Dropdown", module)
  .add("DropdownFilterInput", () => (
    <View style={{ margin: size(3) }}>
      <DropdownFilterInput
        label="Dropdown label"
        placeholder="placeholder"
        dropdownItems={items}
        onItemSelection={(item) => alert(JSON.stringify(item))}
      />
    </View>
  ))
  .add("DropdownFilterModal", () => <ModalItem />);
