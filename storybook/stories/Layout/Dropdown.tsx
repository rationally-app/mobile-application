import React, { ReactElement, useState } from "react";
import { storiesOf } from "@storybook/react-native";
import { View } from "react-native";
import { size } from "../../../src/common/styles";
import {
  DropdownItem,
  DropdownFilterModal,
} from "../../../src/components/DropdownFilterModal/DropdownFilterModal";
import { DropdownFilterInput } from "../../../src/components/DropdownFilterModal/DropdownFilterInput";
import { DarkButton } from "../../../src/components/Layout/Buttons/DarkButton";

const items: DropdownItem[] = [
  //name key is must.It is to show the text in front
  { id: "A", name: "A", tag: true },
  { id: "A1", name: "angellist" },
  { id: "F", name: "F", tag: true },
  { id: "F1", name: "facebook" },
  { id: "F2", name: "foursquare" },
  { id: "G", name: "G", tag: true },
  { id: "G1", name: "github-alt" },
  { id: "G2", name: "github" },
  { id: "G3", name: "gitlab" },
  { id: "I", name: "I", tag: true },
  { id: "I1", name: "instagram" },
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
