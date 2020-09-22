import React from "react";
import { storiesOf } from "@storybook/react-native";
import { View } from "react-native";
import { size } from "../../../src/common/styles";
import { DropdownItem } from "../../../src/components/DropdownFilterModal/DropdownFilterModal";
import { DropdownFilterInput } from "../../../src/components/DropdownFilterModal/DropdownFilterInput";

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
  { id: "I1", name: "instagram" }
];

storiesOf("Layout", module).add("Dropdown", () => (
  <View style={{ margin: size(3) }}>
    <DropdownFilterInput
      label="Dropdown label"
      placeholder="placeholder"
      dropdownItems={items}
      onItemSelection={item => alert(JSON.stringify(item))}
    />
  </View>
));
